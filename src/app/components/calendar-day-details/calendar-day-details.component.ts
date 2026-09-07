import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarEvent } from '../calendar-view/calendar-view.component';

@Component({
  selector: 'app-calendar-day-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './calendar-day-details.component.html',
  styleUrl: './calendar-day-details.component.css'
})
export class CalendarDayDetailsComponent {
  @Input() selectedDay: number | null = null;
  @Input() selectedMonth = new Date().getMonth() + 1;
  @Input() selectedYear = new Date().getFullYear();
  @Input() events: CalendarEvent[] = [];

  getSelectedDayName(): string {
    if (!this.selectedDay) return '';
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const date = new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay);
    return dayNames[date.getDay()];
  }

  getSelectedDayEvents(): CalendarEvent[] {
    return this.events.filter(e =>
      e.day === this.selectedDay &&
      e.month === this.selectedMonth &&
      e.year === this.selectedYear
    );
  }

  getUpcomingEvents(): CalendarEvent[] {
    const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay || 1);

    return this.events
      .filter(e => new Date(e.year, e.month - 1, e.day) > selectedDate)
      .sort((a, b) => new Date(a.year, a.month - 1, a.day).getTime() - new Date(b.year, b.month - 1, b.day).getTime())
      .slice(0, 5);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      academic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      cultural: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      pastoral: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      sports: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  }

  getCategoryBorder(category: string): string {
    const borders: { [key: string]: string } = {
      academic: 'border-blue-500',
      cultural: 'border-yellow-500',
      pastoral: 'border-green-500',
      sports: 'border-red-500'
    };
    return borders[category] || 'border-gray-500';
  }

  getMonthName(month: number = this.selectedMonth): string {
    const months = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month];
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      academic: 'Academico',
      cultural: 'Cultural',
      pastoral: 'Pastoral',
      sports: 'Deportes'
    };
    return labels[category] || category;
  }
}
