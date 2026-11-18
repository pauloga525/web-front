import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CalendarEvent {
  id: number | string;
  time: string;
  title: string;
  location: string;
  category: 'academic' | 'cultural' | 'pastoral' | 'sports';
  day: number;
  month: number;
  year: number;
  /** El evento ya terminó. */
  finalizado?: boolean;
}

export interface CalendarDay {
  day: number | null;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  isSelected: boolean;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css'
})
export class CalendarViewComponent implements OnInit, OnChanges {
  @Input() currentMonth: number = 10; // October
  @Input() currentYear: number = 2024;
  @Input() selectedDay: number | null = 15;
  @Input() events: CalendarEvent[] = []; // Ahora recibe eventos como @Input
  @Output() daySelected = new EventEmitter<number>();
  @Output() monthChanged = new EventEmitter<{ month: number; year: number }>();

  calendarDays: CalendarDay[] = [];

  ngOnInit() {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Regenerar calendario si cambian eventos, mes o año
    if (changes['events'] || changes['currentMonth'] || changes['currentYear']) {
      this.generateCalendar();
    }
  }

  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    const daysInPrevMonth = new Date(this.currentYear, this.currentMonth - 1, 0).getDate();

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      this.calendarDays.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        events: [],
        isSelected: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = this.events.filter(e => e.day === day && e.month === this.currentMonth && e.year === this.currentYear);
      this.calendarDays.push({
        day,
        isCurrentMonth: true,
        events: dayEvents,
        isSelected: day === this.selectedDay
      });
    }

    // Next month days
    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      this.calendarDays.push({
        day,
        isCurrentMonth: false,
        events: [],
        isSelected: false
      });
    }
  }

  previousMonth() {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
    this.monthChanged.emit({ month: this.currentMonth, year: this.currentYear });
  }

  nextMonth() {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
    this.monthChanged.emit({ month: this.currentMonth, year: this.currentYear });
  }

  selectDay(day: number) {
    if (day > 0 && day <= 31) {
      this.selectedDay = day;
      this.generateCalendar();
      this.daySelected.emit(day);
    }
  }

  getMonthName(): string {
    const months = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[this.currentMonth];
  }

  /** Punto del día: relleno si está por venir, solo contorno si ya terminó. */
  getDotClass(event: CalendarEvent): string {
    if (!event.finalizado) return this.getCategoryColor(event.category);
    const borders: { [key: string]: string } = {
      academic: 'border-blue-500',
      cultural: 'border-yellow-500',
      pastoral: 'border-green-500',
      sports: 'border-red-500'
    };
    return 'border-2 bg-transparent ' + (borders[event.category] || 'border-gray-500');
  }

  tituloDia(calendarDay: CalendarDay): string {
    const base = 'Día ' + calendarDay.day;
    if (!calendarDay.events.length) return base;
    const fin = calendarDay.events.filter(e => e.finalizado).length;
    return `${base}: ${calendarDay.events.length} evento(s)` + (fin ? `, ${fin} finalizado(s)` : '');
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      academic: 'bg-blue-500',
      cultural: 'bg-yellow-500',
      pastoral: 'bg-green-500',
      sports: 'bg-red-500'
    };
    return colors[category] || 'bg-gray-500';
  }
}
