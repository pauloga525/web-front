import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NoticiasApiService, NoticiaApi } from '../../services/noticias-api.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, FooterComponent],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class NewsDetailComponent implements OnInit {
  newsId!: string;
  news: NoticiaApi | null = null;
  relatedNews: NoticiaApi[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private noticiasApi: NoticiasApiService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.newsId = params['id'];
      this.loading = true;
      this.noticiasApi.getById(this.newsId).subscribe({
        next: noticia => {
          this.news = noticia;
          this.loading = false;
          // Relacionadas: las primeras 3 del listado general excluyendo la actual
          this.relatedNews = this.noticiasApi.getAll()
            .filter(n => n._id !== this.newsId)
            .slice(0, 3);
        },
        error: () => { this.loading = false; }
      });
    });
  }
}
