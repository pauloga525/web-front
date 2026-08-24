import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EventFilter {
  searchTerm: string;
  category: string;
  month: string;
  year: string;
}

@Component({
  selector: 'app-events-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events-filter.component.html',
  styleUrl: './events-filter.component.css'
})
export class EventsFilterComponent {
  @Output() filterChange = new EventEmitter<EventFilter>();

  filter: EventFilter = {
    searchTerm: '',
    category: '',
    month: 'oct',
    year: '2024'
  };

  categories = [
    { value: '', label: 'Todas las Categorías' },
    { value: 'academic', label: 'Académico' },
    { value: 'sports', label: 'Deportes' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'pastoral', label: 'Pastoral' }
  ];

  months = [
    { value: 'oct', label: 'Octubre' },
    { value: 'nov', label: 'Noviembre' },
    { value: 'dic', label: 'Diciembre' }
  ];

  years = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' }
  ];

  onFilterChange() {
    this.filterChange.emit(this.filter);
  }
}
