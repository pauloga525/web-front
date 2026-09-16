import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { NoticiasApiService, NoticiaApi } from '../../services/noticias-api.service';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { Subscription } from 'rxjs';

interface NoticiasPageConfig {
  heroTitulo:       string;
  heroDescripcion:  string;
  heroImagenFondo:  string;
  destacadasTitulo: string;
  listadoTitulo:    string;
  categorias:       string[];
}

const DEFAULT_CONFIG: NoticiasPageConfig = {
  heroTitulo:       'Noticias',
  heroDescripcion:  'Mantente informado sobre lo que ocurre en nuestra institución.',
  heroImagenFondo:  '',
  destacadasTitulo: 'Noticias Destacadas',
  listadoTitulo:    'Todas las Noticias',
  categorias:       ['Académico', 'Deportes', 'Cultural', 'Institucional'],
};

interface FeaturedNews {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
}

interface NewsArticle {
  _id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  readMore: boolean;
}

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class NewsPageComponent implements OnInit, OnDestroy {
  config: NoticiasPageConfig = DEFAULT_CONFIG;
  featuredNews: FeaturedNews[] = [];
  allNews: NewsArticle[] = [];
  paginatedNews: NewsArticle[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  carouselIndex = 0;
  private carouselTimer?: ReturnType<typeof setInterval>;
  private carouselPausado = false;

  private sub?: Subscription;

  constructor(
    private readonly noticiasApi: NoticiasApiService,
    private readonly configService: ConfiguracionPublicaService,
  ) {}

  ngOnInit(): void {
    this.configService.get<Partial<NoticiasPageConfig>>('noticias_page', DEFAULT_CONFIG)
      .subscribe(config => this.config = {
        ...DEFAULT_CONFIG,
        ...config,
        categorias: config?.categorias ?? DEFAULT_CONFIG.categorias,
      });

    this.sub = this.noticiasApi.noticias$.subscribe(lista => {
      this.featuredNews = lista
        .filter(n => n.destacada)
        .slice(0, 5)
        .map(n => ({
          _id: n._id,
          title: n.title,
          description: n.description,
          category: (n.category || n.tag || '').toUpperCase(),
          date: n.date,
          image: n.featuredImage || n.image,
        }));

      this.allNews = lista.map(n => ({
        _id: n._id,
        tag: (n.category || n.tag || '').toUpperCase(),
        title: n.title,
        description: n.description,
        image: n.featuredImage || n.image,
        readMore: true,
      }));

      this.totalPages = Math.ceil(this.allNews.length / this.itemsPerPage) || 1;
      this.updatePaginatedNews();

      this.carouselIndex = 0;
      this.startCarousel();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.stopCarousel();
  }

  // ── Carrusel de noticias destacadas ────────────────────────────────────
  private startCarousel(): void {
    this.stopCarousel();
    if (this.featuredNews.length > 1) {
      this.carouselTimer = setInterval(() => {
        if (!this.carouselPausado) this.nextSlide();
      }, 6000);
    }
  }

  private stopCarousel(): void {
    if (this.carouselTimer) clearInterval(this.carouselTimer);
  }

  pauseCarousel(): void  { this.carouselPausado = true; }
  resumeCarousel(): void { this.carouselPausado = false; }

  goToSlide(index: number): void {
    if (!this.featuredNews.length) return;
    this.carouselIndex = ((index % this.featuredNews.length) + this.featuredNews.length) % this.featuredNews.length;
  }

  nextSlide(): void { this.goToSlide(this.carouselIndex + 1); }
  prevSlide(): void { this.goToSlide(this.carouselIndex - 1); }

  updatePaginatedNews(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedNews = this.allNews.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedNews();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void { this.goToPage(this.currentPage - 1); }
  nextPage(): void     { this.goToPage(this.currentPage + 1); }

  get heroBackgroundStyle(): string {
    const overlay = 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))';
    return this.config.heroImagenFondo
      ? `${overlay}, url("${this.config.heroImagenFondo}")`
      : overlay;
  }
}
