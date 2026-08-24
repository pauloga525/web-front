import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-program-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.css'
})
export class ProgramCardComponent {
  @Input() program: any;

  constructor(private router: Router) {}

  navigateToCareer(careerTitle: string) {
    const slug = careerTitle.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
    this.router.navigate(['/programa/especialidad', slug]);
  }
}
