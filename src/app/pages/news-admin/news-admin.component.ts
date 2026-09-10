import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { NoticiasApiService, NoticiaApi } from '../../services/noticias-api.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-news-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, FooterComponent],
  templateUrl: './news-admin.component.html',
  styleUrl: './news-admin.component.css',
})
export class NewsAdminComponent implements OnInit, OnDestroy {
  newsList: NoticiaApi[] = [];
  private sub?: Subscription;

  constructor(
    private readonly noticiasApi: NoticiasApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.noticiasApi.noticias$.subscribe(lista => {
      this.newsList = lista;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  viewNews(id: string): void {
    this.router.navigate(['/noticias', id]);
  }

  goToDashboard(): void {
    window.open(environment.adminUrl, '_blank', 'noopener');
  }
}
