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
interface Plataforma { id: number; name: string; image: string; url: string; }

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
  // Plataformas digitales — mismo título y lista que Campus, Repositorio,
  // Inicio e Instructivos (config 'campus').
  plataformas: Plataforma[] = [];
  plataformasTitulo = 'Plataformas Digitales';
  plataformasDescripcion = '';

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
    this.configPublica.get<Plataforma[]>('plataformas', []).subscribe(list => {
      this.plataformas = Array.isArray(list) ? list.filter(p => p.image) : [];
    });
    this.configPublica.get<{ plataformasTitulo?: string; plataformasDescripcion?: string }>('campus', {}).subscribe(cfg => {
      if (cfg?.plataformasTitulo) this.plataformasTitulo = cfg.plataformasTitulo;
      if (cfg?.plataformasDescripcion) this.plataformasDescripcion = cfg.plataformasDescripcion;
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

  // ─── Paginación ─────────────────────────────────────────────────────────────

  readonly pageSize = 15; // 3 filas de 5 libros

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredBooks.length / this.pageSize));
  }

  /** Página actual, ajustada si los filtros redujeron el total. */
  get page(): number {
    return Math.min(Math.max(1, this.currentPage), this.totalPages);
  }

  get pagedBooks(): Book[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredBooks.slice(start, start + this.pageSize);
  }

  /** Números de página a mostrar; `null` es un "…". Siempre incluye la primera, la última y las vecinas de la actual. */
  get pageItems(): (number | null)[] {
    const total = this.totalPages, actual = this.page;
    const visibles = new Set([1, total, actual - 1, actual, actual + 1].filter(n => n >= 1 && n <= total));
    if (actual <= 3) [2, 3, 4].forEach(n => n <= total && visibles.add(n));
    if (actual >= total - 2) [total - 3, total - 2, total - 1].forEach(n => n >= 1 && visibles.add(n));
    const orden = [...visibles].sort((a, b) => a - b);
    const items: (number | null)[] = [];
    orden.forEach((n, i) => {
      if (i > 0 && n - orden[i - 1] > 1) items.push(orden[i - 1] + 2 === n ? orden[i - 1] + 1 : null);
      items.push(n);
    });
    return items;
  }

  onSearch(): void { this.currentPage = 1; }
  onFilterChange(): void { this.currentPage = 1; }
  onSortChange(): void { this.currentPage = 1; }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) return;
    this.currentPage = page;
    document.getElementById('catalogo-libros')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
