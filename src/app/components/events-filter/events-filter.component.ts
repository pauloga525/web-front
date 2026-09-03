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

  /**
   * Años disponibles para el select. Los calcula el padre (events-page) a
   * partir de los eventos reales que existen, en vez de venir fijos aquí
   * (antes eran solo '2024'/'2025' y no incluían el año en el que
   * realmente estaban cargados los eventos, así que filtrar por año
   * siempre devolvía una lista vacía).
   */
  @Input() years: { value: string; label: string }[] = [
    { value: '', label: 'Todos los años' },
  ];

  filter: EventFilter = {
    searchTerm: '',
    category: '',
    month: '',
    year: ''
  };

  /**
   * Antes solo había 3 meses (oct/nov/dic) con valores de texto ('oct') que
   * el backend nunca podía interpretar como número de mes (1-12), por lo
   * que el filtro de mes no hacía absolutamente nada. Ahora son los 12
   * meses reales con su número correspondiente.
   */
  months = [
    { value: '',   label: 'Todos los meses' },
    { value: '1',  label: 'Enero' },
    { value: '2',  label: 'Febrero' },
    { value: '3',  label: 'Marzo' },
    { value: '4',  label: 'Abril' },
    { value: '5',  label: 'Mayo' },
    { value: '6',  label: 'Junio' },
    { value: '7',  label: 'Julio' },
    { value: '8',  label: 'Agosto' },
    { value: '9',  label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  onFilterChange() {
    this.filterChange.emit(this.filter);
  }
}
