import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { LogrosApiService, LogroApi } from '../../services/logros-api.service';

@Component({
  selector: 'app-achievement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './achievement-detail.component.html',
  styleUrl: './achievement-detail.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class AchievementDetailComponent implements OnInit {
  achievement: LogroApi | undefined;
  relatedAchievements: LogroApi[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private logrosApi: LogrosApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loading = true;
      this.logrosApi.getById(id).subscribe({
        next: logro => {
          this.achievement = logro;
          this.loading = false;
          this.relatedAchievements = this.logrosApi.getAll()
            .filter(l => l._id !== id && l.category === logro.category)
            .slice(0, 3);
        },
        error: () => { this.loading = false; }
      });
    });
  }
}
