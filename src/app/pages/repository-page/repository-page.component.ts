import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-repository-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BreadcrumbComponent, FooterComponent],
  templateUrl: './repository-page.component.html',
  styleUrl: './repository-page.component.css'
})
export class RepositoryPageComponent implements OnInit {
  searchQuery: string = '';
  selectedFaculty: string = '';
  selectedYear: string = '';
  selectedDocType: string = '';

  collections = [
    { id: 1, icon: 'school', title: 'Tesis de Grado', count: 850, description: 'Trabajos de titulación de pregrado y posgrado de todas las facultades.' },
    { id: 2, icon: 'article', title: 'Revistas Científicas', count: 120, description: 'Artículos publicados en nuestras revistas institucionales indexadas.' },
    { id: 3, icon: 'science', title: 'Investigación Docente', count: 240, description: 'Producción científica generada por nuestro cuerpo docente e investigadores.' },
    { id: 4, icon: 'menu_book', title: 'Libros y Capítulos', count: 45, description: 'Publicaciones editoriales y capítulos de libros académicos.' }
  ];

  recentPublications = [
    {
      type: 'Tesis de Grado',
      title: 'Análisis del impacto de la inteligencia artificial en la educación secundaria rural',
      authors: 'María González',
      date: 'Oct 12, 2023',
      access: 'open'
    },
    {
      type: 'Artículo Científico',
      title: 'Sostenibilidad ambiental en procesos industriales del sector textil',
      authors: 'Dr. Juan Pérez, Ing. Ana Lopez',
      date: 'Sep 28, 2023',
      access: 'open'
    },
    {
      type: 'Tesis de Maestría',
      title: 'Estrategias de marketing digital para PYMES post-pandemia',
      authors: 'Carlos Ruiz',
      date: 'Sep 15, 2023',
      access: 'restricted'
    }
  ];

  navigationLinks = [
    { icon: 'domain', label: 'Facultades' },
    { icon: 'person', label: 'Autores' },
    { icon: 'calendar_month', label: 'Fecha de Publicación' },
    { icon: 'key', label: 'Palabras Clave' }
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialize component data
  }

  onSearch(): void {
    console.log('Searching:', {
      query: this.searchQuery,
      faculty: this.selectedFaculty,
      year: this.selectedYear,
      docType: this.selectedDocType
    });
  }
}
