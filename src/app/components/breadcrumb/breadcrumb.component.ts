import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AutoridadesApiService } from '../../services/autoridades-api.service';

interface BreadcrumbItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [];
  private authoritySub?: Subscription;

  private readonly breadcrumbMap: { [key: string]: BreadcrumbItem[] } = {
    '/': [{ label: 'Inicio', path: '/' }],
    '/about': [
      { label: 'Inicio', path: '/' },
      { label: 'Nosotros', path: '/about' }
    ],
    '/admissions': [
      { label: 'Inicio', path: '/' },
      { label: 'Admisiones', path: '/admissions' }
    ],
    '/contact': [
      { label: 'Inicio', path: '/' },
      { label: 'Contacto', path: '/contact' }
    ],
    '/events': [
      { label: 'Inicio', path: '/' },
      { label: 'Eventos', path: '/events' }
    ],
    '/events/': [
      { label: 'Inicio', path: '/' },
      { label: 'Eventos', path: '/events' },
      { label: 'Detalle', path: '' }
    ],
    '/calendar': [
      { label: 'Inicio', path: '/' },
      { label: 'Calendario', path: '/calendar' }
    ],
    '/estudiantes': [
      { label: 'Inicio', path: '/' },
      { label: 'Vida Estudiantil', path: '/estudiantes' }
    ],    '/gallery': [
      { label: 'Inicio', path: '/' },
      { label: 'Nuestros Estudiantes', path: '/estudiantes' },
      { label: 'Galería', path: '/gallery' }
    ],
    '/noticias': [
      { label: 'Inicio', path: '/' },
      { label: 'Noticias', path: '/noticias' }
    ],    '/servicios': [
      { label: 'Inicio', path: '/' },
      { label: 'Servicios', path: '/servicios' }
    ],
    '/programa/preparatoria': [
      { label: 'Inicio', path: '/' },
      { label: 'Programas', path: '/' },
      { label: 'Preparatoria', path: '/programa/preparatoria' }
    ],
    '/programa/basica-elemental': [
      { label: 'Inicio', path: '/' },
      { label: 'Programas', path: '/' },
      { label: 'Basica Elemental', path: '/programa/basica-elemental' }
    ],
    '/programa/basica-superior': [
      { label: 'Inicio', path: '/' },
      { label: 'Programas', path: '/' },
      { label: 'Basica Superior', path: '/programa/basica-superior' }
    ],
    '/programa/bachillerato': [
      { label: 'Inicio', path: '/' },
      { label: 'Programas', path: '/' },
      { label: 'Bachillerato', path: '/programa/bachillerato' }
    ],
    '/programa/': [
      { label: 'Inicio', path: '/' },
      { label: 'Programas', path: '' },
      { label: 'Detalle', path: '' }
    ],
    '/carrera/': [
      { label: 'Inicio', path: '/' },
      { label: 'Carreras', path: '/programa/bachillerato' },
      { label: 'Detalle', path: '' }
    ],
    '/estudiantes/alumnos': [
      { label: 'Inicio', path: '/' },
      { label: 'Vida Estudiantil', path: '/estudiantes' },
      { label: 'Alumnos', path: '/estudiantes/alumnos' }
    ],
    '/authority': [
      { label: 'Inicio', path: '/' },
      { label: 'Nuestras Autoridades', path: '/about' }
    ],
    '/authority/': [
      { label: 'Inicio', path: '/' },
      { label: 'Nuestras Autoridades', path: '/about' },
      { label: 'Detalle', path: '' }
    ],
    '/vida-estudiantil': [
      { label: 'Inicio', path: '/' },
      { label: 'Vida Estudiantil', path: '/vida-estudiantil' }
    ]
  };

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly autoridadesApi: AutoridadesApiService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateBreadcrumbs(event.urlAfterRedirects);
      });
    
    // Set initial breadcrumb
    this.updateBreadcrumbs(this.router.url);
  }

  ngOnDestroy(): void {
    this.authoritySub?.unsubscribe();
  }

  private updateBreadcrumbs(url: string) {
    // Check exact match first
    if (this.breadcrumbMap[url]) {
      this.breadcrumbs = this.breadcrumbMap[url];
      return;
    }

    // Check for dynamic routes
    if (url.startsWith('/events/')) {
      this.breadcrumbs = [
        { label: 'Inicio', path: '/' },
        { label: 'Eventos', path: '/events' },
        { label: 'Detalle del Evento', path: url }
      ];
    } else if (url.startsWith('/programa/') && url !== '/programa/bachillerato') {
      const level = url.replace('/programa/', '');
      this.breadcrumbs = [
        { label: 'Inicio', path: '/' },
        { label: 'Programas', path: '/programa/bachillerato' },
        { label: this.formatLabel(level), path: url }
      ];
    } else if (url.startsWith('/carrera/')) {
      const careerName = url.replace('/carrera/', '');
      this.breadcrumbs = [
        { label: 'Inicio', path: '/' },
        { label: 'Carreras', path: '/programa/bachillerato' },
        { label: this.formatLabel(careerName), path: url }
      ];
    } else if (url.startsWith('/authority/')) {
      const authorityId = url.replace('/authority/', '');
      this.breadcrumbs = [
        { label: 'Inicio', path: '/' },
        { label: 'Nosotros', path: '/about' },
        { label: 'Autoridad', path: url }
      ];
      this.loadAuthorityBreadcrumb(authorityId, url);
    } else {
      this.breadcrumbs = [{ label: 'Inicio', path: '/' }];
    }
  }

  private loadAuthorityBreadcrumb(authorityId: string, url: string): void {
    this.authoritySub?.unsubscribe();
    this.authoritySub = this.autoridadesApi.getById(authorityId).subscribe({
      next: authority => {
        this.breadcrumbs = [
          { label: 'Inicio', path: '/' },
          { label: 'Nosotros', path: '/about' },
          { label: authority.title || authority.categoryLabel || 'Autoridad', path: url }
        ];
      },
      error: () => {
        this.breadcrumbs = [
          { label: 'Inicio', path: '/' },
          { label: 'Nosotros', path: '/about' },
          { label: 'Autoridad', path: url }
        ];
      }
    });
  }

  private formatLabel(text: string): string {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Si no hay historial, ir a la página de inicio
      this.router.navigate(['/']);
    }
  }
}
