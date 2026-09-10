import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

interface InstructivoCard {
  id: number;
  title: string;
  description: string;
  type: 'pdf' | 'video';
  icon: string;
  colorClass: string;
  category: string;
  duration?: string;
  fileSize?: string;
  updatedDate: string;
  buttonText: string;
  hoverColor: string;
}

@Component({
  selector: 'app-instructivos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './instructivos-page.component.html',
  styleUrls: ['./instructivos-page.component.css']
})
export class InstructivosPageComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'Esemtia';
  sortBy: string = 'Recientes';

  categories = [
    { name: 'Esemtia', count: 12, icon: 'school' },
    { name: 'Moodle', count: 8, icon: 'class' },
    { name: 'Zoom', count: 5, icon: 'videocam' },
    { name: 'Procesos Admin.', count: 4, icon: 'assignment' }
  ];

  instructivos: InstructivoCard[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initializeInstructivos();
  }

  initializeInstructivos(): void {
    this.instructivos = [
      {
        id: 1,
        title: 'Acceso a Notas - Padres',
        description: 'Guía completa para consultar el reporte de calificaciones y observaciones conductuales.',
        type: 'pdf',
        icon: 'picture_as_pdf',
        colorClass: 'bg-blue-50',
        category: 'Esemtia',
        fileSize: '2.4 MB',
        updatedDate: 'Actualizado hace 2 días',
        buttonText: 'Descargar (2.4 MB)',
        hoverColor: 'hover:border-blue-300'
      },
      {
        id: 2,
        title: 'Justificación de Faltas',
        description: 'Tutorial paso a paso para justificar inasistencias desde la aplicación móvil.',
        type: 'video',
        icon: 'play_circle',
        colorClass: 'bg-blue-50',
        category: 'Esemtia',
        duration: '5:32 min',
        updatedDate: '5:32 min',
        buttonText: 'Ver Tutorial',
        hoverColor: 'hover:border-blue-300'
      },
      {
        id: 3,
        title: 'Actualización de Datos',
        description: 'Instructivo para mantener actualizada la información de contacto y médica del estudiante.',
        type: 'pdf',
        icon: 'picture_as_pdf',
        colorClass: 'bg-blue-50',
        category: 'Esemtia',
        fileSize: '1.1 MB',
        updatedDate: 'Actualizado hace 1 semana',
        buttonText: 'Descargar (1.1 MB)',
        hoverColor: 'hover:border-blue-300'
      },
      {
        id: 4,
        title: 'Mensajería Interna',
        description: 'Cómo enviar y recibir comunicados oficiales con docentes y autoridades.',
        type: 'pdf',
        icon: 'picture_as_pdf',
        colorClass: 'bg-blue-50',
        category: 'Esemtia',
        fileSize: '1.8 MB',
        updatedDate: 'Actualizado hace 2 semanas',
        buttonText: 'Descargar (1.8 MB)',
        hoverColor: 'hover:border-blue-300'
      },
      {
        id: 5,
        title: 'Recuperar Contraseña',
        description: 'Pasos para restablecer tu acceso a la plataforma en caso de olvido.',
        type: 'video',
        icon: 'play_circle',
        colorClass: 'bg-blue-50',
        category: 'Esemtia',
        duration: '3:15 min',
        updatedDate: '3:15 min',
        buttonText: 'Ver Tutorial',
        hoverColor: 'hover:border-blue-300'
      },
      {
        id: 6,
        title: 'Manual Completo de Esemtia',
        description: 'Documento integral con todas las funcionalidades de la plataforma.',
        type: 'pdf',
        icon: 'picture_as_pdf',
        colorClass: 'bg-blue-50',
        category: 'Esemtia',
        fileSize: '5.2 MB',
        updatedDate: 'Versión 2023',
        buttonText: 'Descargar (5.2 MB)',
        hoverColor: 'hover:border-blue-300'
      }
    ];
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
  }

  onSearch(): void {
    // Implementar lógica de búsqueda
    console.log('Buscando:', this.searchTerm);
  }

  getDisplayDate(instructivo: InstructivoCard): string {
    if (instructivo.type === 'video') {
      return instructivo.duration || '';
    }
    return instructivo.updatedDate;
  }

  getTagColor(type: string): string {
    return type === 'pdf' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';
  }

  getTagText(type: string): string {
    return type === 'pdf' ? 'PDF' : 'Video';
  }

  getIconColor(type: string): string {
    return type === 'pdf' ? 'text-red-500' : 'text-secondary';
  }

  getSymbolColor(type: string): string {
    return type === 'pdf' ? 'text-yellow-200' : 'text-blue-200';
  }

  getButtonColor(type: string): string {
    return type === 'pdf' ? 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-secondary hover:border-secondary'
      : 'bg-secondary text-white hover:bg-secondary/80';
  }

  getHoverTextColor(): string {
    return 'group-hover:text-secondary';
  }
}
