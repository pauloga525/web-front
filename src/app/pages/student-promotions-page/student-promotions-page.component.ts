import { Component, OnDestroy, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';

interface GaleriaImagen { id: number; url: string; alt: string; caption: string; }
interface Club { id: number; icon: string; title: string; description: string; }
interface Promocion { id: number; classOf: string; cursos?: { id: number; name: string; image: string; url?: string }[]; url?: string; }
interface Logro { id: number; badge: string; date: string; title: string; description: string; image: string; }
interface Instalacion { id: number; title: string; description: string; image: string; }

interface EstudiantesPageConfig {
  heroTitulo: string;
  heroDescripcion: string;
  heroImagen: string;
  heroBoton1Label: string;
  heroBoton1Url: string;
  heroBoton2Label: string;
  heroBoton2Url: string;
  galeriaTitulo: string;
  galeriaUrl: string;
  galeria: GaleriaImagen[];
  clubesTitulo: string;
  clubes: Club[];
  promocionesTitulo: string;
  promocionesDescripcion: string;
  promociones: Promocion[];
  logrosTitulo: string;
  logrosUrl: string;
  logros: Logro[];
  instalacionesTitulo: string;
  instalaciones: Instalacion[];
}

const DEFAULT_CONFIG: EstudiantesPageConfig = {
  heroTitulo: 'Experiencia en Campus',
  heroDescripcion: 'Unete a una comunidad vibrante de innovadores, creativos y lideres. Descubre donde tu pasion se encuentra con el proposito en un ambiente disenado para el crecimiento.',
  heroImagen: '',
  heroBoton1Label: 'Tour Virtual',
  heroBoton1Url: '#',
  heroBoton2Label: 'Descargar Folleto',
  heroBoton2Url: '#',
  galeriaTitulo: 'Vida en Movimiento',
  galeriaUrl: '/gallery',
  galeria: [],
  clubesTitulo: 'Clubes y Organizaciones Estudiantiles',
  clubes: [],
  promocionesTitulo: 'Nuestros Alumnos',
  promocionesDescripcion: 'Honrando el legado de excelencia de nuestros graduados. Cada generacion marca un hito en nuestra historia academica.',
  promociones: [],
  logrosTitulo: 'Logros Estudiantiles',
  logrosUrl: '/estudiantes/logros',
  logros: [],
  instalacionesTitulo: 'Instalaciones',
  instalaciones: [],
};

@Component({
  selector: 'app-student-promotions-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './student-promotions-page.component.html',
  styleUrl: './student-promotions-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class StudentPromotionsPageComponent implements OnInit, OnDestroy {
  config: EstudiantesPageConfig = DEFAULT_CONFIG;
  private readonly destroy$ = new Subject<void>();

  // ── Gallery carousel ────────────────────────────────────────────────────────
  galleryIndex = 0;
  private galleryTimer: ReturnType<typeof setInterval> | null = null;

  // ── Gallery lightbox ────────────────────────────────────────────────────────
  lightboxOpen  = false;
  lightboxIndex = 0;
  lightboxScale = 1;
  lightboxTX    = 0;
  lightboxTY    = 0;
  isDragging    = false;
  private dragStartX  = 0;
  private dragStartY  = 0;
  private dragStartTX = 0;
  private dragStartTY = 0;

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadConfig();

    this.websocket.on('configuracion:estudiantes_page:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => this.applyConfig(data?.datos ?? data));
  }

  ngOnDestroy(): void {
    this.stopGalleryCarousel();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get heroImage(): string {
    return this.config.heroImagen;
  }

  get galleryItems(): GaleriaImagen[] {
    return this.config.galeria.filter(item => item.url);
  }

  get promotions(): Promocion[] {
    return this.config.promociones.filter(item => item.classOf || (item.cursos && item.cursos.length > 0));
  }

  get clubs(): Club[] {
    return this.config.clubes.filter(item => item.title || item.description);
  }

  get achievements(): Logro[] {
    return this.config.logros.filter(item => item.title || item.description);
  }

  loadConfig(): void {
    this.configService.get<Partial<EstudiantesPageConfig>>('estudiantes_page', DEFAULT_CONFIG)
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => this.applyConfig(config));
  }

  navigateToPromotion(promotion: Promocion): void {
    if (promotion.url && promotion.url !== '#') {
      window.location.href = promotion.url;
      return;
    }

    const year = this.extractYear(promotion.classOf);
    this.router.navigate(['/gallery', year], { fragment: 'promociones-section' });
  }

  private applyConfig(config?: Partial<EstudiantesPageConfig>): void {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      galeria: config?.galeria ?? DEFAULT_CONFIG.galeria,
      clubes: config?.clubes ?? DEFAULT_CONFIG.clubes,
      promociones: config?.promociones ?? DEFAULT_CONFIG.promociones,
      logros: config?.logros ?? DEFAULT_CONFIG.logros,
      instalaciones: config?.instalaciones ?? DEFAULT_CONFIG.instalaciones,
    };
    this.galleryIndex = 0;
    this.startGalleryCarousel();
  }

  private extractYear(value: string): string {
    return /\d{4}/.exec(value)?.[0] ?? '';
  }

  // ── Gallery carousel methods ────────────────────────────────────────────────

  private startGalleryCarousel(): void {
    this.stopGalleryCarousel();
    const len = this.galleryItems.length;
    if (len > 1) {
      this.galleryTimer = setInterval(() => {
        this.galleryIndex = (this.galleryIndex + 1) % len;
      }, 4000);
    }
  }

  private stopGalleryCarousel(): void {
    if (this.galleryTimer) {
      clearInterval(this.galleryTimer);
      this.galleryTimer = null;
    }
  }

  prevGallery(): void {
    const len = this.galleryItems.length;
    if (len > 0) {
      this.galleryIndex = (this.galleryIndex - 1 + len) % len;
      this.startGalleryCarousel();
    }
  }

  nextGallery(): void {
    const len = this.galleryItems.length;
    if (len > 0) {
      this.galleryIndex = (this.galleryIndex + 1) % len;
      this.startGalleryCarousel();
    }
  }

  goToGallery(i: number): void {
    this.galleryIndex = i;
    this.startGalleryCarousel();
  }

  // ── Gallery lightbox methods ────────────────────────────────────────────────

  openLightbox(index: number): void {
    this.lightboxIndex = index;
    this.lightboxScale = 1;
    this.lightboxTX    = 0;
    this.lightboxTY    = 0;
    this.lightboxOpen  = true;
    this.stopGalleryCarousel();
  }

  closeLightbox(): void {
    this.lightboxOpen  = false;
    this.lightboxScale = 1;
    this.lightboxTX    = 0;
    this.lightboxTY    = 0;
    this.startGalleryCarousel();
  }

  prevLightbox(): void {
    const len = this.galleryItems.length;
    if (!len) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + len) % len;
    this.lightboxScale = 1; this.lightboxTX = 0; this.lightboxTY = 0;
  }

  nextLightbox(): void {
    const len = this.galleryItems.length;
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
    const step = e.deltaY < 0 ? 0.25 : -0.25;
    this.lightboxScale = Math.min(5, Math.max(1, this.lightboxScale + step));
    if (this.lightboxScale === 1) { this.lightboxTX = 0; this.lightboxTY = 0; }
  }

  lbDragStart(e: MouseEvent): void {
    if (this.lightboxScale <= 1) return;
    this.isDragging  = true;
    this.dragStartX  = e.clientX;
    this.dragStartY  = e.clientY;
    this.dragStartTX = this.lightboxTX;
    this.dragStartTY = this.lightboxTY;
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
    if (e.key === 'Escape')     this.closeLightbox();
    if (e.key === 'ArrowLeft')  this.prevLightbox();
    if (e.key === 'ArrowRight') this.nextLightbox();
    if (e.key === '+')          this.lbZoomIn();
    if (e.key === '-')          this.lbZoomOut();
  }
}
