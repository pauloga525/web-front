import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SuppressImageWarningDirective } from '../../directives/suppress-image-warning.directive';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';

interface Plataforma { id: number; name: string; image: string; url: string; }

@Component({
  selector: 'app-repository-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BreadcrumbComponent, FooterComponent, SuppressImageWarningDirective],
  templateUrl: './repository-page.component.html',
  styleUrl: './repository-page.component.css'
})
export class RepositoryPageComponent implements OnInit {
  searchQuery: string = '';
  selectedFaculty: string = '';
  selectedYear: string = '';
  selectedDocType: string = '';

  // "Enlaces de Interés" — antes esta sección estaba fija en el HTML con
  // logos locales que ni el admin de Repositorios ni el de Campus podían
  // tocar. El título y la lista de logos ahora vienen de la config
  // 'campus' (plataformasTitulo/plataformas), la misma que alimenta
  // Campus, Inicio, Biblioteca e Instructivos, para que las 5 páginas
  // muestren siempre el mismo título.
  enlacesTitulo = 'Enlaces de Interés';
  plataformasDescripcion = '';
  plataformas: Plataforma[] = [];

  constructor(private configService: ConfiguracionPublicaService) {}

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

  ngOnInit(): void {
    this.configService.get<{ plataformasTitulo?: string; plataformasDescripcion?: string }>('campus', {}).subscribe(cfg => {
      if (cfg?.plataformasTitulo) this.enlacesTitulo = cfg.plataformasTitulo;
      if (cfg?.plataformasDescripcion) this.plataformasDescripcion = cfg.plataformasDescripcion;
    });

    this.configService.get<Plataforma[]>('plataformas', []).subscribe(list => {
      this.plataformas = Array.isArray(list) ? list.filter(p => p.image) : [];
    });
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
