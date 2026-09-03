import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  /**
   * Categorías disponibles para el select. Las provee el componente padre
   * (events-page) a partir de la lista real gestionada en el panel
   * administrativo (Eventos > Categorías) — antes venían fijas aquí con
   * valores en inglés ('academic', 'sports'...) que nunca coincidían con
   * la categoría real guardada en cada evento, por lo que el filtro nunca
   * devolvía resultados. Se deja un fallback por si aún no ha cargado.
   */
  @Input() categories: { value: string; label: string }[] = [
    { value: '', label: 'Todas las Categorías' },
  ];

  filter: EventFilter = {
    searchTerm: '',
    category: '',
    month: 'oct',
    year: '2024'
  };

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
