import { Injectable } from '@angular/core';
import { LogrosApiService, LogroApi } from './logros-api.service';

export interface Achievement {
  id: string;
  badge: string;
  badgeClass: string;
  date: string;
  title: string;
  category: string;
  description: string;
  image: string;
  featured?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AchievementsService {
  constructor(private readonly api: LogrosApiService) {}

  getAllAchievements(): Achievement[] {
    return this.api.getAll().map(l => this.toItem(l));
  }

  getFeaturedAchievements(): Achievement[] {
    return this.api.getAll().filter(l => l.featured).map(l => this.toItem(l));
  }

  getAchievementsByCategory(category: string): Achievement[] {
    const all = this.api.getAll();
    const filtered = category === 'Todos' ? all : all.filter(l => l.category === category);
    return filtered.map(l => this.toItem(l));
  }

  getAchievementById(id: string | number): Achievement | undefined {
    const l = this.api.getAll().find(l => l._id === String(id));
    return l ? this.toItem(l) : undefined;
  }

  getCategories(): string[] {
    return this.api.getCategories();
  }

  private toItem(l: LogroApi): Achievement {
    return {
      id: l._id,
      badge: l.badge,
      badgeClass: l.badgeClass,
      date: l.date,
      title: l.title,
      category: l.category,
      description: l.description,
      image: l.image,
      featured: l.featured,
    };
  }
}
