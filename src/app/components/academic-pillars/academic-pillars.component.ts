import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pillar {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-academic-pillars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './academic-pillars.component.html',
  styleUrl: './academic-pillars.component.css'
})
export class AcademicPillarsComponent {
  pillars: Pillar[] = [
    {
      icon: 'lightbulb',
      title: 'Pensamiento Crítico',
      description: 'Desarrollamos la capacidad de análisis, argumentación y resolución de problemas complejos.'
    },
    {
      icon: 'diversity_3',
      title: 'Desarrollo Socio-emocional',
      description: 'Fortalecemos la inteligencia emocional, la empatía y el trabajo colaborativo en el aula.'
    },
    {
      icon: 'school',
      title: 'Excelencia Académica',
      description: 'Altos estándares de rendimiento con un currículo riguroso y actualizado.'
    }
  ];
}
