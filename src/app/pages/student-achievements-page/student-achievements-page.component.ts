import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { LogrosApiService, LogroApi } from '../../services/logros-api.service';

@Component({
  selector: 'app-student-achievements-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './student-achievements-page.component.html',
  styleUrl: './student-achievements-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class StudentAchievementsPageComponent implements OnInit {
  achievements: LogroApi[] = [];
  categories: string[] = [];
  selectedCategory = 'Todos';

  constructor(private logrosApi: LogrosApiService) {}

  ngOnInit(): void {
    this.logrosApi.logros$.subscribe(lista => {
      this.achievements = lista;
      const cats = new Set(lista.map(l => l.category));
      this.categories = ['Todos', ...Array.from(cats)];
    });
  }

  get filteredAchievements(): LogroApi[] {
    if (this.selectedCategory === 'Todos') return this.achievements;
    return this.achievements.filter(a => a.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}
