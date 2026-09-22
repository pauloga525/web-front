import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SuppressImageWarningDirective } from '../../directives/suppress-image-warning.directive';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';

interface Plataforma { id: number; name: string; image: string; url: string; }

interface RepoStat        { id: number; numero: string; etiqueta: string; }
interface RepoColeccion   { id: number; icon: string; title: string; description: string; count: string; }
interface RepoPublicacion { id: number; type: string; title: string; authors: string; date: string; access: 'open' | 'restricted'; }
interface RepoNavLink     { id: number; icon: string; label: string; href: string; }

/**
 * Misma forma que RepositoriosConfig del admin (services/repositorios.service.ts
 * en web-admin) — se lee de la clave 'repositorios', la misma en la que guarda
 * el editor. Antes esta página ignoraba esa clave por completo y todo el
 * contenido (hero, colecciones, publicaciones, sidebar) estaba fijo aquí, así
 * que ningún cambio hecho en el panel admin se reflejaba nunca en el sitio.
 */
interface RepositoriosConfig {
  heroBadgeIcon:  string;
  heroBadgeText:  string;
  heroTitulo:     string;
  heroSubtitulo:  string;
  heroStats:      RepoStat[];
  colecciones:    RepoColeccion[];
  pubTitulo:      string;
  pubVerTodoUrl:  string;
  publicaciones:  RepoPublicacion[];
  guiaTitulo:     string;
  guiaTexto:      string;
  guiaUrl:        string;
  guiaBotonLabel: string;
  navTitulo:      string;
  navLinks:       RepoNavLink[];
  soporteHorario: string;
  soporteEmail:   string;
}

const DEFAULT_CONFIG: RepositoriosConfig = {
  heroBadgeIcon:  'school',
  heroBadgeText:  'Archivo Institucional',
  heroTitulo:     'Repositorio Digital',
  heroSubtitulo:  'Preservando y difundiendo la producción intelectual, científica y académica de nuestra comunidad. Acceso abierto al conocimiento.',
  heroStats: [
    { id: 1, numero: '1,240+', etiqueta: 'Documentos Digitalizados' },
    { id: 2, numero: '850+',   etiqueta: 'Tesis de Grado'           },
  ],
  colecciones: [
    { id: 1, icon: 'school',      title: 'Tesis de Grado',         description: 'Trabajos de titulación de bachillerato.',            count: '850+' },
    { id: 2, icon: 'article',     title: 'Artículos Científicos',  description: 'Publicaciones en revistas indexadas.',               count: '320+' },
    { id: 3, icon: 'menu_book',   title: 'Libros y Capítulos',     description: 'Producción editorial de docentes e investigadores.', count: '140+' },
    { id: 4, icon: 'description', title: 'Informes Técnicos',      description: 'Documentos técnicos y reportes institucionales.',     count: '130+' },
  ],
  pubTitulo:     'Últimas Publicaciones',
  pubVerTodoUrl: '',
  publicaciones: [
    { id: 1, type: 'Tesis',    title: 'Diseño de sistema de control para brazo robótico',  authors: 'García, J.', date: '2024', access: 'open'       },
    { id: 2, type: 'Artículo', title: 'Implementación de energías renovables en Ecuador',  authors: 'López, M.',  date: '2024', access: 'open'       },
    { id: 3, type: 'Informe',  title: 'Análisis de rendimiento académico 2023',            authors: 'UETS',       date: '2023', access: 'restricted' },
  ],
  guiaTitulo:     'Guía de Autoarchivo',
  guiaTexto:      '¿Deseas publicar tu tesis o investigación en el repositorio? Consulta nuestra guía paso a paso para estudiantes y docentes.',
  guiaUrl:        '',
  guiaBotonLabel: 'Ver Guía de Envío',
  navTitulo:      'Navegar por',
  navLinks: [
    { id: 1, icon: 'school',         label: 'Tesis y Proyectos', href: '' },
    { id: 2, icon: 'article',        label: 'Artículos',         href: '' },
    { id: 3, icon: 'person',         label: 'Por Autor',         href: '' },
    { id: 4, icon: 'calendar_today', label: 'Por Año',           href: '' },
  ],
  soporteHorario: 'Lunes a Viernes 8:00 - 17:00',
  soporteEmail:   'biblioteca@uets.edu.ec',
};

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

  config: RepositoriosConfig = DEFAULT_CONFIG;

  // "Enlaces de Interés" — el título y la lista de logos vienen de la config
  // 'campus' (plataformasTitulo/plataformas), la misma que alimenta Campus,
  // Inicio, Biblioteca e Instructivos, para que las 5 páginas muestren
  // siempre el mismo título.
  enlacesTitulo = 'Enlaces de Interés';
  plataformasDescripcion = '';
  plataformas: Plataforma[] = [];

  constructor(private configService: ConfiguracionPublicaService) {}

  ngOnInit(): void {
    this.configService.get<Partial<RepositoriosConfig>>('repositorios', DEFAULT_CONFIG).subscribe(cfg => {
      this.config = {
        ...DEFAULT_CONFIG,
        ...cfg,
        heroStats:     cfg?.heroStats     ?? DEFAULT_CONFIG.heroStats,
        colecciones:   cfg?.colecciones   ?? DEFAULT_CONFIG.colecciones,
        publicaciones: cfg?.publicaciones ?? DEFAULT_CONFIG.publicaciones,
        navLinks:      cfg?.navLinks      ?? DEFAULT_CONFIG.navLinks,
      };
    });

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
