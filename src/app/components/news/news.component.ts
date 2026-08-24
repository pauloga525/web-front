import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoticiasApiService, NoticiaApi } from '../../services/noticias-api.service';

interface NewsItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  newsItems: NewsItem[] = [];

  constructor(private noticiasApi: NoticiasApiService) {}

  ngOnInit(): void {
    this.noticiasApi.noticias$.subscribe(lista => {
      this.newsItems = lista.slice(0, 2).map(n => ({
        _id: n._id,
        title: n.title,
        category: n.category || n.tag,
        description: n.description,
        image: n.featuredImage || n.image,
      }));
    });
  }
}
