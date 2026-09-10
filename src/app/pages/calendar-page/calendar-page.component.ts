import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalendarViewComponent, CalendarEvent } from '../../components/calendar-view/calendar-view.component';
import { CalendarDayDetailsComponent } from '../../components/calendar-day-details/calendar-day-details.component';
import { EventosApiService, EventoApi } from '../../services/eventos-api.service';

type Categoria = CalendarEvent['category'];

interface CategoriaFiltro {
  key: Categoria;
  label: string;
  dot: string;
}

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    BreadcrumbComponent,
    FooterComponent,
    CalendarViewComponent,
    CalendarDayDetailsComponent
  ],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class CalendarPageComponent implements OnInit, OnDestroy {
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  selectedDay = new Date().getDate();

  events: CalendarEvent[] = [];
  private eventosSub?: Subscription;

  // ── Filtro por categoría ─────────────────────────────────────────────────
  // Antes el botón "Filtrar" no tenía ningún manejador — no hacía nada al
  // hacer clic. Ahora abre un panel con las 4 categorías (todas activas por
  // defecto) y tanto el calendario como el panel de detalles del día solo
  // muestran los eventos de las categorías activas.
  readonly categorias: CategoriaFiltro[] = [
    { key: 'academic', label: 'Académico', dot: 'bg-blue-500' },
    { key: 'cultural', label: 'Cultural',  dot: 'bg-yellow-500' },
    { key: 'pastoral', label: 'Pastoral',  dot: 'bg-green-500' },
    { key: 'sports',   label: 'Deportes',  dot: 'bg-red-500' },
  ];
  activeCategories = new Set<Categoria>(this.categorias.map(c => c.key));
  filtroAbierto = false;

  get filteredEvents(): CalendarEvent[] {
    return this.events.filter(e => this.activeCategories.has(e.category));
  }

  get hayFiltrosActivos(): boolean {
    return this.activeCategories.size < this.categorias.length;
  }

  @ViewChild('filtroWrapper') filtroWrapper?: ElementRef<HTMLElement>;

  constructor(private readonly eventosApi: EventosApiService) {}

  ngOnInit(): void {
    this.eventosSub = this.eventosApi.eventos$.subscribe(eventos => {
      this.events = this.convertApiEventsToCalendarEvents(eventos);
      this.moveToFirstEventIfNeeded();
    });
  }

  ngOnDestroy(): void {
    this.eventosSub?.unsubscribe();
  }

  private convertApiEventsToCalendarEvents(eventos: EventoApi[]): CalendarEvent[] {
    return eventos
      .map((evento): CalendarEvent | null => {
        const [year, month, day] = (evento.fecha || '').split('-').map(part => Number.parseInt(part, 10));

        if (!year || !month || !day) {
          return null;
        }

        return {
          id: evento.slug || evento._id,
          time: this.formatTimeRange(evento),
          title: evento.titulo,
          location: evento.ubicacion || evento.direccion || 'Campus',
          category: this.mapCategory(evento.categoria),
          day,
          month,
          year
        };
      })
      .filter((event): event is CalendarEvent => event !== null);
  }

  private formatTimeRange(evento: EventoApi): string {
    if (evento.horaInicio && evento.horaFin) {
      return `${evento.horaInicio} - ${evento.horaFin}`;
    }

    return evento.horaInicio || 'Todo el dia';
  }

  private moveToFirstEventIfNeeded(): void {
    const hasEventsInCurrentMonth = this.events.some(event =>
      event.month === this.currentMonth && event.year === this.currentYear
    );

    if (hasEventsInCurrentMonth || this.events.length === 0) {
      return;
    }

    const currentDate = new Date(this.currentYear, this.currentMonth - 1, this.selectedDay);
    const firstUpcomingEvent = [...this.events]
      .filter(event => new Date(event.year, event.month - 1, event.day) >= currentDate)
      .sort((a, b) => new Date(a.year, a.month - 1, a.day).getTime() - new Date(b.year, b.month - 1, b.day).getTime())[0];

    if (firstUpcomingEvent) {
      this.currentMonth = firstUpcomingEvent.month;
      this.currentYear = firstUpcomingEvent.year;
      this.selectedDay = firstUpcomingEvent.day;
    }
  }

  private mapCategory(category: string): 'academic' | 'cultural' | 'pastoral' | 'sports' {
    const normalized = (category || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const categoryMap: Record<string, 'academic' | 'cultural' | 'pastoral' | 'sports'> = {
      academico: 'academic',
      academic: 'academic',
      cultural: 'cultural',
      cultura: 'cultural',
      pastoral: 'pastoral',
      deportes: 'sports',
      sports: 'sports',
      deportivo: 'sports',
      comunidad: 'cultural',
      community: 'cultural'
    };

    return categoryMap[normalized] || 'academic';
  }

  onDaySelected(day: number): void {
    this.selectedDay = day;
  }

  onMonthChanged(monthData: { month: number; year: number }): void {
    this.currentMonth = monthData.month;
    this.currentYear = monthData.year;
  }

  downloadPDF(): void {
    alert('Descargando calendario en PDF...');
  }

  toggleFiltro(): void {
    this.filtroAbierto = !this.filtroAbierto;
  }

  toggleCategoria(cat: Categoria): void {
    if (this.activeCategories.has(cat)) {
      this.activeCategories.delete(cat);
    } else {
      this.activeCategories.add(cat);
    }
    // Reasignar para que Angular detecte el cambio (Set es el mismo objeto).
    this.activeCategories = new Set(this.activeCategories);
  }

  limpiarFiltros(): void {
    this.activeCategories = new Set(this.categorias.map(c => c.key));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.filtroAbierto && this.filtroWrapper && !this.filtroWrapper.nativeElement.contains(event.target as Node)) {
      this.filtroAbierto = false;
    }
  }
}
