import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { VideoModalComponent } from '../../components/video-modal/video-modal.component';
import { EspecialidadesApiService, Especialidad } from '../../services/especialidades-api.service';
import { WebsocketService } from '../../services/websocket.service';
import { IconService } from '../../services/icon.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-specialty-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, FooterComponent, VideoModalComponent],
  templateUrl: './specialty-detail.component.html',
  styleUrl: './specialty-detail.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class SpecialtyDetailComponent implements OnInit, OnDestroy {
  specialty: Especialidad | undefined;
  loading = true;
  expandedYears: Set<string> = new Set();
  isVideoModalOpen = false;
  videoUrl = '';
  carouselIndex = 0;
  private carouselTimer: ReturnType<typeof setInterval> | null = null;

  // ── Lightbox ────────────────────────────────────────────────────────────────
  lightboxOpen      = false;
  lightboxIndex     = 0;
  lightboxScale     = 1;
  lightboxTX        = 0;
  lightboxTY        = 0;
  isDragging        = false;
  private dragStartX  = 0;
  private dragStartY  = 0;
  private dragStartTX = 0;
  private dragStartTY = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private especialidadesApi: EspecialidadesApiService,
    private websocket: WebsocketService,
    public iconService: IconService
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params['slug'];
      this.loadSpecialty(slug);
    });

    // Escuchar cambios de especialidades en tiempo real
    this.websocket.on('especialidad:actualizado')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const slug = this.route.snapshot.params['slug'];
        this.loadSpecialty(slug);
      });
  }

  ngOnDestroy() {
    this.stopCarousel();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startCarousel(): void {
    this.stopCarousel();
    const len = this.specialty?.instalaciones?.length ?? 0;
    if (len > 1) {
      this.carouselTimer = setInterval(() => {
        this.carouselIndex = (this.carouselIndex + 1) % len;
      }, 4000);
    }
  }

  private stopCarousel(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = null;
    }
  }

  private loadSpecialty(slug: string) {
    this.loading = true;
    this.especialidadesApi.getAllEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (especialidades: Especialidad[]) => {
          const toSlug = (s: string) =>
            s.toLowerCase()
              .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '-');

          const found = especialidades.find(e =>
            (e.slug && e.slug === slug) ||
            (e.titulo && toSlug(e.titulo) === slug) ||
            (e.nombre && toSlug(e.nombre) === slug)
          );
          
          if (found) {
            this.specialty = found;
            this.videoUrl = found.videoUrl || found.video_url || '';
            this.carouselIndex = 0;
            this.loading = false;
            this.startCarousel();
          } else {
            this.router.navigate(['/']);
          }
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/']);
        }
      });
  }

  toggleYear(year: string): void {
    if (this.expandedYears.has(year)) {
      this.expandedYears.delete(year);
    } else {
      this.expandedYears.add(year);
    }
  }

  isYearExpanded(year: string): boolean {
    return this.expandedYears.has(year);
  }

  openVideoModal(): void {
    this.isVideoModalOpen = true;
  }

  closeVideoModal(): void {
    this.isVideoModalOpen = false;
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 120; // margen extra para que el título sea visible
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // ── Lightbox ───────────────────────────────────────────────────────────────

  openLightbox(index: number): void {
    this.lightboxIndex = index;
    this.lightboxScale = 1;
    this.lightboxTX    = 0;
    this.lightboxTY    = 0;
    this.lightboxOpen  = true;
    this.stopCarousel();
  }

  closeLightbox(): void {
    this.lightboxOpen  = false;
    this.lightboxScale = 1;
    this.lightboxTX    = 0;
    this.lightboxTY    = 0;
    this.startCarousel();
  }

  prevLightbox(): void {
    const len = this.specialty?.instalaciones?.length ?? 0;
    if (!len) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + len) % len;
    this.lightboxScale = 1; this.lightboxTX = 0; this.lightboxTY = 0;
  }

  nextLightbox(): void {
    const len = this.specialty?.instalaciones?.length ?? 0;
    if (!len) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % len;
    this.lightboxScale = 1; this.lightboxTX = 0; this.lightboxTY = 0;
  }

  lbZoomIn(): void  { this.lightboxScale = Math.min(this.lightboxScale + 0.5, 5); }

  lbZoomOut(): void {
    this.lightboxScale = Math.max(this.lightboxScale - 0.5, 1);
    if (this.lightboxScale === 1) { this.lightboxTX = 0; this.lightboxTY = 0; }
  }

  lbResetZoom(): void { this.lightboxScale = 1; this.lightboxTX = 0; this.lightboxTY = 0; }

  lbGoTo(i: number): void {
    this.lightboxIndex = i;
    this.lightboxScale = 1; this.lightboxTX = 0; this.lightboxTY = 0;
  }

  lbWheel(e: WheelEvent): void {
    e.preventDefault();
    const step  = e.deltaY < 0 ? 0.25 : -0.25;
    this.lightboxScale = Math.min(5, Math.max(1, this.lightboxScale + step));
    if (this.lightboxScale === 1) { this.lightboxTX = 0; this.lightboxTY = 0; }
  }

  lbDragStart(e: MouseEvent): void {
    if (this.lightboxScale <= 1) return;
    this.isDragging   = true;
    this.dragStartX   = e.clientX;
    this.dragStartY   = e.clientY;
    this.dragStartTX  = this.lightboxTX;
    this.dragStartTY  = this.lightboxTY;
  }

  lbDragMove(e: MouseEvent): void {
    if (!this.isDragging) return;
    this.lightboxTX = this.dragStartTX + (e.clientX - this.dragStartX);
    this.lightboxTY = this.dragStartTY + (e.clientY - this.dragStartY);
  }

  lbDragEnd(): void { this.isDragging = false; }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape')      this.closeLightbox();
    if (e.key === 'ArrowLeft')   this.prevLightbox();
    if (e.key === 'ArrowRight')  this.nextLightbox();
    if (e.key === '+')           this.lbZoomIn();
    if (e.key === '-')           this.lbZoomOut();
  }

  // ── Carrusel ────────────────────────────────────────────────────────────────

  prevInstalacion(): void {
    const len = this.specialty?.instalaciones?.length ?? 0;
    if (len > 0) {
      this.carouselIndex = (this.carouselIndex - 1 + len) % len;
      this.startCarousel();
    }
  }

  nextInstalacion(): void {
    const len = this.specialty?.instalaciones?.length ?? 0;
    if (len > 0) {
      this.carouselIndex = (this.carouselIndex + 1) % len;
      this.startCarousel();
    }
  }

  goToInstalacion(i: number): void {
    this.carouselIndex = i;
    this.startCarousel();
  }

  getInstalacionUrl(item: any): string {
    if (typeof item === 'string') return item;
    return item?.url || '';
  }

  getInstalacionTitulo(item: any, fallback: string): string {
    if (typeof item === 'string') return fallback;
    return item?.titulo || fallback;
  }
}
