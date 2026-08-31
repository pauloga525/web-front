import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { RecursosApiService } from '../../services/recursos-api.service';

interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  url: string;
  available: boolean;
  isNew: boolean;
  categoria: string;
}

interface LibroCategoria { id: number; nombre: string; }

interface BibliotecaPageConfig {
  heroTitulo:      string;
  heroDescripcion: string;
  catalogoTitulo:  string;
  categorias:      LibroCategoria[];
}

const TODAS = 'Todo el catálogo';

const DEFAULT_CONFIG: BibliotecaPageConfig = {
  heroTitulo:      'Biblioteca UETS',
  heroDescripcion: 'Centro de recursos para el aprendizaje y la investigación.',
  catalogoTitulo:  'Catálogo de Libros',
  categorias:      [{ id: 1, nombre: TODAS }],
};

@Component({
  selector: 'app-biblioteca-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './biblioteca-page.component.html',
  styleUrls: ['./biblioteca-page.component.css']
})
export class BibliotecaPageComponent implements OnInit {
  config: BibliotecaPageConfig = DEFAULT_CONFIG;
  books: Book[] = [];

  searchTerm: string = '';
  filterCategory: string = TODAS;
  sortBy: string = 'Más recientes';
  currentPage: number = 1;

  constructor(
    private configPublica: ConfiguracionPublicaService,
    private recursosApi: RecursosApiService,
  ) {}

  ngOnInit(): void {
    this.configPublica.get<BibliotecaPageConfig>('biblioteca_page', DEFAULT_CONFIG).subscribe(cfg => {
      this.config = { ...DEFAULT_CONFIG, ...cfg };
      this.filterCategory = this.config.categorias[0]?.nombre ?? TODAS;
    });
    this.recursosApi.getByTipo('libro').subscribe(list => {
      this.books = list.map(r => ({
        id: r._id,
        title: r.titulo,
        author: r.descripcion,
        image: r.imagen,
        url: r.url,
        categoria: r.categoria,
        available: (r.tags ?? []).includes('disponible'),
        isNew: (r.tags ?? []).includes('nuevo'),
      }));
    });
  }

  get filteredBooks(): Book[] {
    let list = this.books;
    if (this.filterCategory && this.filterCategory !== TODAS) {
      list = list.filter(b => b.categoria === this.filterCategory);
    }
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(b => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term));
    }
    list = [...list];
    if (this.sortBy === 'Título (A-Z)') list.sort((a, b) => a.title.localeCompare(b.title));
    else if (this.sortBy === 'Autor (A-Z)') list.sort((a, b) => a.author.localeCompare(b.author));
    return list;
  }

  onSearch(): void {}
  onFilterChange(): void {}
  onSortChange(): void {}

  goToPage(page: number): void {
    this.currentPage = page;
  }
}
