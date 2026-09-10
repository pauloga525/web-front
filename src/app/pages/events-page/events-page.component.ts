import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { EventsFilterComponent, EventFilter } from '../../components/events-filter/events-filter.component';
import { FeaturedEventComponent } from '../../components/featured-event/featured-event.component';
import { EventCardComponent, EventItem } from '../../components/event-card/event-card.component';
import { EventsPaginationComponent } from '../../components/events-pagination/events-pagination.component';
import { EventosApiService, EventoApi } from '../../services/eventos-api.service';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';

interface HeroEventosApi {
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  imagenFondo: string;
}

interface CategoriaEventoApi {
  id: number;
  nombre: string;
  color: string;
}

const HERO_DEFAULT: HeroEventosApi = {
  etiqueta: '',
  titulo: 'Eventos Institucionales',
  subtitulo: 'Descubre las actividades académicas, culturales y deportivas que dan vida a nuestra comunidad educativa.',
  imagenFondo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHVzmkiSD0N0_TEi55Q6_5yHsy7bVgTGIiWqDv2gDW5UZrsb7-3_UtzoyguNg0mLtYQ6ANqH2zCw3yNarHY24lKiau3ZazE--dYJV4u2vgg5CZkjRHH_dw2UbclsS-ZTCFOIw27Ta9tXz39vqD8weBDfoS7CcFs9Cq8m-2oIfGWI5_5KAm0oQeJT14DrqCxd8yHlVlqgx0h2cxyfJwodx7rAW3hhRWLvWe7b9tQ33Siob4qxiEwHKqJP8c7Uqn1_vu2XiVmM4fxFk',
};

const CATEGORIAS_DEFAULT: CategoriaEventoApi[] = [
  { id: 1, nombre: 'Académico', color: 'blue' },
  { id: 2, nombre: 'Cultural', color: 'yellow' },
  { id: 3, nombre: 'Pastoral', color: 'green' },
  { id: 4, nombre: 'Deportes', color: 'red' },
  { id: 5, nombre: 'Comunidad', color: 'purple' },
];

/** Convierte un EventoApi del backend al formato EventItem que usan los componentes del template */
function toEventItem(e: EventoApi): EventItem {
  const fecha = e.fecha ?? '';                          // YYYY-MM-DD
  const parts = fecha.split('-');
  const meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const mesIdx = parts[1] ? Number.parseInt(parts[1], 10) - 1 : 0;
  return {
    id:             e.slug || e._id,
    title:          e.titulo,
    date:           `${e.horaInicio ?? '08:00'} - ${e.horaFin ?? '17:00'}`,
    day:            parts[2] ?? '',
    month:          meses[mesIdx] ?? '',
    category:       e.categoria,
    categoriaColor: e.categoriaColor,
    location:       e.ubicacion,
    description:    e.descripcionCorta,
    image:          e.imagenPrincipal,
  };
}

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    BreadcrumbComponent,
    FooterComponent,
    EventsFilterComponent,
    FeaturedEventComponent,
    EventCardComponent,
    EventsPaginationComponent
  ],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class EventsPageComponent implements OnInit {
  currentPage = 1;
  totalPages = 1;
  porPagina = 6;
  totalItems = 0;

  featuredEvent: EventItem | null = null;
  filteredEvents: EventItem[] = [];

  // Sin año por defecto: antes se forzaba el año actual desde el primer
  // render, así que los eventos de otros años quedaban ocultos sin que
  // nada en la pantalla lo indicara. Ahora se muestran todos hasta que el
  // usuario elija un año puntual.
  currentFilter: EventFilter = {
    searchTerm: '',
    category: '',
    month: '',
    year: ''
  };

  // Años disponibles para el filtro — se calculan a partir de los eventos
  // publicados que realmente existen (no una lista fija), para que el
  // desplegable siempre incluya los años con datos reales.
  aniosFiltro: { value: string; label: string }[] = [
    { value: '', label: 'Todos los años' },
  ];

  // Hero banner — editable desde el panel administrativo (Eventos > Config. Hero)
  heroEtiqueta    = HERO_DEFAULT.etiqueta;
  heroTitulo      = HERO_DEFAULT.titulo;
  heroSubtitulo   = HERO_DEFAULT.subtitulo;
  heroImagenFondo = HERO_DEFAULT.imagenFondo;

  // Categorías del filtro — editables desde el panel (Eventos > Categorías)
  categoriasFiltro: { value: string; label: string }[] = [
    { value: '', label: 'Todas las Categorías' },
    ...CATEGORIAS_DEFAULT.map(c => ({ value: c.nombre, label: c.nombre })),
  ];

  constructor(
    private readonly eventosApi: EventosApiService,
    private readonly configPublica: ConfiguracionPublicaService,
  ) {}

  ngOnInit() {
    this.eventosApi.getDestacado().subscribe(ev => {
      this.featuredEvent = ev ? toEventItem(ev) : null;
    });
    this.loadPage(1);

    this.configPublica.get<HeroEventosApi>('eventos_hero', HERO_DEFAULT).subscribe(hero => {
      if (!hero) return;
      this.heroEtiqueta    = hero.etiqueta    || '';
      this.heroTitulo      = hero.titulo      || HERO_DEFAULT.titulo;
      this.heroSubtitulo   = hero.subtitulo   || HERO_DEFAULT.subtitulo;
      this.heroImagenFondo = hero.imagenFondo || HERO_DEFAULT.imagenFondo;
    });

    this.configPublica.get<CategoriaEventoApi[]>('eventos_categorias', CATEGORIAS_DEFAULT).subscribe(cats => {
      const lista = Array.isArray(cats) && cats.length ? cats : CATEGORIAS_DEFAULT;
      this.categoriasFiltro = [
        { value: '', label: 'Todas las Categorías' },
        ...lista.map(c => ({ value: c.nombre, label: c.nombre })),
      ];
    });

    this.eventosApi.eventos$.subscribe(eventos => {
      const anios = new Set<string>();
      for (const ev of eventos) {
        const anio = (ev.fecha ?? '').slice(0, 4);
        if (/^\d{4}$/.test(anio)) anios.add(anio);
      }
      this.aniosFiltro = [
        { value: '', label: 'Todos los años' },
        ...Array.from(anios).sort((a, b) => Number(b) - Number(a)).map(a => ({ value: a, label: a })),
      ];
    });
  }

  loadPage(pagina: number): void {
    const anio = this.currentFilter.year ? Number(this.currentFilter.year) : undefined;
    const mes  = this.currentFilter.month ? Number(this.currentFilter.month) : undefined;

    this.eventosApi.filtrar({
      q:         this.currentFilter.searchTerm || undefined,
      categoria: this.currentFilter.category   || undefined,
      mes,
      anio,
      pagina,
      porPagina: this.porPagina,
    }).subscribe(res => {
      this.filteredEvents = res.items.map(toEventItem);
      this.totalItems  = res.total;
      this.totalPages  = Math.ceil(res.total / this.porPagina) || 1;
      this.currentPage = pagina;
    });
  }

  applyFilter(filter: EventFilter) {
    this.currentFilter = filter;
    this.loadPage(1);
  }

  onPageChange(page: number) {
    this.loadPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
