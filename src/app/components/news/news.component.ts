import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoticiasApiService } from '../../services/noticias-api.service';

interface NewsItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  /** Noticia principal (la primera marcada como destacada; si no hay, la más reciente). */
  lead: NewsItem | null = null;
  /** Hasta 3 noticias más, en la columna lateral. */
  others: NewsItem[] = [];

  constructor(private readonly noticiasApi: NoticiasApiService) {}

  ngOnInit(): void {
    this.noticiasApi.noticias$.subscribe(lista => {
      const items = lista.map((n): NewsItem & { destacada: boolean } => ({
        _id: n._id,
        title: n.title,
        category: n.category || n.tag,
        description: n.description,
        image: n.featuredImage || n.image,
        date: n.date || '',
        readTime: n.readTime || '',
        destacada: !!n.destacada,
      }));
      const idx = Math.max(0, items.findIndex(n => n.destacada));
      this.lead = items[idx] ?? null;
      this.others = items.filter((_, i) => i !== idx).slice(0, 3);
    });
  }
}
