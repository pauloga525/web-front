import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';

interface Subject {
  name: string;
}

interface Curriculum {
  title: string;
  description: string;
  items: { icon: string; title: string; description: string }[];
}

@Component({
  selector: 'app-academic-program',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, BreadcrumbComponent, FooterComponent],
  templateUrl: './academic-program.component.html',
  styleUrl: './academic-program.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class AcademicProgramComponent {
  levelName = 'Programas Académicos';
  levelDescription = 'Explorar nuestra oferta completa de programas diseñados para impulsar tu desarrollo académico y profesional.';
  sectionTitle = 'Nuestras Opciones Educativas';
  sectionDescription = 'Contamos con una variedad de programas diseñados para satisfacer las necesidades educativas de cada estudiante en diferentes etapas de su desarrollo académico.';
  sectionExtra = '';
  environmentTitle = '';
  environmentDescription = '';

  currentFilters = {
    grade: '',
    focus: ''
  };

  programs: any[] = [
    {
      id: 1,
      title: 'Preparatoria',
      description: 'Educación inicial para niños de 4 y 5 años con enfoque lúdico.',
      focus: 'initial',
      duration: '1 Año',
      modality: 'Presencial',
      image: '/image/basicamedia/Maria_auxiliadora.webp'
    },
    {
      id: 2,
      title: 'Básica Elemental',
      description: 'Cimientos sólidos en lectura, escritura y lógica matemática (Grados 1-3).',
      focus: 'academic',
      duration: '3 Años',
      modality: 'Presencial',
      image: '/image/basicamedia/Maria_auxiliadora.webp'
    },
    {
      id: 3,
      title: 'Básica Media',
      description: 'Desarrollo de competencias analíticas y consolidación de conocimientos (Grados 6-8).',
      focus: 'academic',
      duration: '3 Años',
      modality: 'Presencial',
      image: '/image/basicamedia/Maria_auxiliadora.webp'
    },
    {
      id: 4,
      title: 'Básica Superior',
      description: 'Potenciamos habilidades de nuestros estudiantes de 8vo, 9no y 10mo año.',
      focus: 'advanced',
      duration: '3 Años',
      modality: 'Presencial',
      image: '/image/academico/fondo.webp'
    },
    {
      id: 5,
      title: 'Bachillerato General',
      description: 'Preparación integral para el éxito universitario y desarrollo de liderazgo.',
      focus: 'advanced',
      duration: '3 Años',
      modality: 'Presencial',
      image: '/image/academico/fondo.webp'
    }
  ];

  get filteredPrograms() {
    return this.programs.filter(program => {
      const gradeMatch = !this.currentFilters.grade || program.id.toString() === this.currentFilters.grade;
      const focusMatch = !this.currentFilters.focus || program.focus === this.currentFilters.focus;
      return gradeMatch && focusMatch;
    });
  }

  keyFacts = [
    { icon: 'school', title: 'Niveles educativos', value: '5 opciones' },
    { icon: 'people', title: 'Estudiantes', value: '+1500' },
    { icon: 'star', title: 'Acreditación', value: 'Certificada' }
  ];

  curriculumHighlights = [
    {
      icon: 'language',
      title: 'Inglés Avanzado',
      description: 'Certificación Cambridge en todos los niveles.'
    },
    {
      icon: 'computer',
      title: 'Tecnología',
      description: 'Integración de tecnología en todas las disciplinas.'
    }
  ];

  subjects: Subject[] = [];

  constructor(private readonly route: ActivatedRoute) {}

  onFilterChange() {
    // El filtro se aplica automáticamente a través del getter filteredPrograms
  }

  navigateToCareer(title: string) {
    console.log('Navegando a: ' + title);
    // Implementar navegación si es necesaria
  }

  requestInfo() {
    alert('Redirigiendo al formulario de admisión...');
  }
}
