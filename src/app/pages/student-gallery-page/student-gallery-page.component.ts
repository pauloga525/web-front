import { Component, ViewEncapsulation, PLATFORM_ID, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { Subject, takeUntil } from 'rxjs';

interface Photo {
  title: string;
  date: string;
  image: string;
}

interface PromotionGroup {
  year: string;
  photos: Photo[];
}

interface PromocionItem {
  id: number;
  classOf: string;
  curso?: string;
  image?: string;
  url?: string;
  cursos?: { id: number; name: string; image: string; url?: string }[];
}

interface EstudiantesPageConfig {
  promociones?: PromocionItem[];
}

@Component({
  selector: 'app-student-gallery-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './student-gallery-page.component.html',
  styleUrl: './student-gallery-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class StudentGalleryPageComponent implements OnInit, OnDestroy {
  searchQuery = '';
  selectedYear = 'todos';
  
  years = ['todos'];
  categories = [
    { label: 'Todos', value: 'todos' },
    { label: 'Promociones', value: 'promociones' },
    { label: 'Eventos', value: 'eventos' },
    { label: 'Campus', value: 'campus' },
    { label: 'Vida Estudiantil', value: 'vida-estudiantil' },
    { label: 'Investigación', value: 'investigacion' }
  ];

  // Paginación de años
  currentPage = 1;
  yearsPerPage = 2; // Mostrar 2 años por página
  maxPageButtons = 5;

  promotionGroups: PromotionGroup[] = [];
  private destroy$ = new Subject<void>();

  // Modal de visualización
  isViewerOpen = false;
  viewerPhotos: Photo[] = [];
  currentPhotoIndex = 0;
  zoomLevel = 1;
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private configService: ConfiguracionPublicaService,
  ) {}

  ngOnInit() {
    this.loadConfig();

    // Leer parámetro de ruta de forma segura (funciona en SSR)
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['year']) {
        this.selectedYear = params['year'];
        this.currentPage = 1;
      }
    });

    // Manejar scroll a fragmento (solo en navegador)
    if (isPlatformBrowser(this.platformId)) {
      this.route.fragment.pipe(takeUntil(this.destroy$)).subscribe(fragment => {
        if (fragment) {
          setTimeout(() => {
            const element = document.getElementById(fragment);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      });
    }
  }

  openPhotoViewer(photos: Photo[], index: number) {
    this.viewerPhotos = photos;
    this.currentPhotoIndex = index;
    this.zoomLevel = 1;
    this.isViewerOpen = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeViewer() {
    this.isViewerOpen = false;
    this.zoomLevel = 1;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadConfig(): void {
    this.configService.get<EstudiantesPageConfig>('estudiantes_page', { promociones: [] })
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => this.applyConfig(config));
  }

  private applyConfig(config?: EstudiantesPageConfig): void {
    const promotions = config?.promociones ?? [];
    this.promotionGroups = this.buildPromotionGroups(promotions);
    this.years = ['todos', ...Array.from(new Set(this.promotionGroups.map(group => group.year)))];
  }

  private buildPromotionGroups(promotions: PromocionItem[]): PromotionGroup[] {
    const groupsMap = new Map<string, Photo[]>();

    for (const promo of promotions) {
      const yearMatch = promo.classOf.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : promo.classOf || 'Sin año';
      const photos = groupsMap.get(year) ?? [];

      const cursos = (promo as any).cursos;
      if (cursos && Array.isArray(cursos) && cursos.length) {
        for (const c of cursos) {
          photos.push({ title: promo.classOf, date: c.name ?? '', image: c.image });
        }
      } else {
        photos.push({ title: promo.classOf, date: promo.curso ?? '', image: promo.image ?? '' });
      }

      groupsMap.set(year, photos);
    }

    return Array.from(groupsMap.entries())
      .map(([year, photos]) => ({ year, photos }))
      .sort((a, b) => Number(b.year) - Number(a.year));
  }

  nextPhoto() {
    if (this.currentPhotoIndex < this.viewerPhotos.length - 1) {
      this.currentPhotoIndex++;
      this.zoomLevel = 1;
    }
  }

  previousPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
      this.zoomLevel = 1;
    }
  }

  selectPhoto(index: number) {
    this.currentPhotoIndex = index;
    this.zoomLevel = 1;
  }

  zoomIn() {
    if (this.zoomLevel < 3) {
      this.zoomLevel += 0.5;
    }
  }

  zoomOut() {
    if (this.zoomLevel > 1) {
      this.zoomLevel -= 0.5;
    }
  }

  get filteredPromotionGroups(): PromotionGroup[] {
    const query = this.searchQuery?.trim().toLowerCase();
    const filteredByYear = this.selectedYear === 'todos'
      ? this.promotionGroups
      : this.promotionGroups.filter(group => group.year === this.selectedYear);

    if (!query) {
      return filteredByYear;
    }

    return filteredByYear
      .map(group => ({
        year: group.year,
        photos: group.photos.filter(photo =>
          photo.title.toLowerCase().includes(query) ||
          photo.date.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.photos.length > 0);
  }

  get totalYears(): number {
    return this.filteredPromotionGroups.length;
  }

  get totalPages(): number {
    // Si está en "todos los años", no paginar (solo 1 página)
    if (this.selectedYear === 'todos') {
      return 1;
    }
    return Math.ceil(this.totalYears / this.yearsPerPage);
  }

  get paginatedPromotionGroups(): PromotionGroup[] {
    // Si está en "todos los años", mostrar todas sin paginar
    if (this.selectedYear === 'todos') {
      return this.filteredPromotionGroups;
    }
    
    // Si está filtrando por un año específico, paginar
    const startIndex = (this.currentPage - 1) * this.yearsPerPage;
    const endIndex = startIndex + this.yearsPerPage;
    return this.filteredPromotionGroups.slice(startIndex, endIndex);
  }

  get pageNumbers(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const maxButtons = this.maxPageButtons;
    
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  get showFirstDots(): boolean {
    return this.pageNumbers[0] > 1;
  }

  get showLastDots(): boolean {
    return this.pageNumbers[this.pageNumbers.length - 1] < this.totalPages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  onYearFilterChange() {
    this.currentPage = 1;
  }

  get currentPhoto(): Photo {
    return this.viewerPhotos[this.currentPhotoIndex];
  }
}
