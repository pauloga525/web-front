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

  currentFilter: EventFilter = {
    searchTerm: '',
    category: '',
    month: '',
    year: String(new Date().getFullYear())
  };

  constructor(private readonly eventosApi: EventosApiService) {}

  ngOnInit() {
    this.eventosApi.getDestacado().subscribe(ev => {
      this.featuredEvent = ev ? toEventItem(ev) : null;
    });
    this.loadPage(1);
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
