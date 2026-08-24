import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalendarViewComponent, CalendarEvent } from '../../components/calendar-view/calendar-view.component';
import { CalendarDayDetailsComponent } from '../../components/calendar-day-details/calendar-day-details.component';
import { EventosApiService, EventoApi } from '../../services/eventos-api.service';

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

  constructor(private eventosApi: EventosApiService) {}

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
        const [year, month, day] = (evento.fecha || '').split('-').map(part => parseInt(part, 10));

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
}
