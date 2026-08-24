import { Component, ViewEncapsulation, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { NoticiasApiService, NoticiaApi } from '../../services/noticias-api.service';
import { Subscription } from 'rxjs';

interface FeaturedNews {
  _id: string;
  title: string;
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
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  featuredNews: FeaturedNews[] = [];
  allNews: NewsArticle[] = [];
  paginatedNews: NewsArticle[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  private sub?: Subscription;

  constructor(
    private ngZone: NgZone,
    private noticiasApi: NoticiasApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.noticiasApi.noticias$.subscribe(lista => {
      this.featuredNews = lista
        .filter(n => n.destacada)
        .slice(0, 4)
        .map(n => ({ _id: n._id, title: n.title, date: n.date, image: n.featuredImage || n.image }));

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
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

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

  navigateToNewsDetail(id: string): void {
    this.router.navigate(['/noticias', id]);
  }

  scrollLeft(): void {
    this.scrollContainer?.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.scrollContainer?.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
