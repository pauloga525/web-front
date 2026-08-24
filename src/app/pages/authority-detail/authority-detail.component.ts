import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { AutoridadesApiService, AutoridadApi } from '../../services/autoridades-api.service';

@Component({
  selector: 'app-authority-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './authority-detail.component.html',
  styleUrl: './authority-detail.component.css'
})
export class AuthorityDetailComponent implements OnInit {
  authority: AutoridadApi | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private autoridadesApi: AutoridadesApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loading = true;
      this.autoridadesApi.getById(id).subscribe({
        next: auth => {
          this.authority = auth;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/']);
        }
      });
    });
  }

  goBack() {
    this.router.navigate(['/about']);
  }
}
