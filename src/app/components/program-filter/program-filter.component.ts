import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-program-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './program-filter.component.html'
})
export class ProgramFilterComponent {
  @Output() filterChange = new EventEmitter<any>();

  filters = {
    faculty: '',
    modality: '',
    duration: ''
  };

  faculties = ['All Faculties', 'Business', 'Tech', 'Arts', 'Health', 'Engineering'];
  modalities = ['Any Modality', 'Presencial', 'Online', 'Hybrid'];
  durations = ['Any Duration', 'Short Courses', 'Undergrad (4-5 Years)', 'Grad (1-2 Years)'];

  onFilterChange() {
    this.filterChange.emit({
      faculty: this.filters.faculty === 'All Faculties' ? '' : this.filters.faculty,
      modality: this.filters.modality === 'Any Modality' ? '' : this.filters.modality,
      duration: this.filters.duration === 'Any Duration' ? '' : this.filters.duration
    });
  }
}
