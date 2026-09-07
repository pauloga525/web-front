import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SuppressImageWarningDirective } from '../../directives/suppress-image-warning.directive';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';

interface NavSubItem {
  label: string;
  routerLink: string;
}

interface NavItem {
  label: string;
  routerLink: string;
  hasDropdown?: boolean;
  submenu?: NavSubItem[];
}

interface SiteHeaderConfig {
  logoUrl: string;
  logoAlt: string;
  aulaVirtualUrl: string;
  aulaVirtualLabel: string;
  navItems: NavItem[];
}

const DEFAULT_HEADER_CONFIG: SiteHeaderConfig = {
  logoUrl: '',
  logoAlt: 'Logo Unidad Educativa Ecuador',
  aulaVirtualUrl: 'https://edu.esemtia.com/LoginEsemtia.aspx',
  aulaVirtualLabel: 'Aula Virtual',
  navItems: [
    { label: 'Inicio', routerLink: '/' },
    {
      label: 'Academico',
      routerLink: '',
      hasDropdown: true,
      submenu: [
        { label: 'Preparatoria', routerLink: '/programa/preparatoria' },
        { label: 'Basica Elemental', routerLink: '/programa/basica-elemental' },
        { label: 'Basica Media', routerLink: '/programa/basica-media' },
        { label: 'Basica Superior', routerLink: '/programa/basica-superior' },
        { label: 'Bachillerato', routerLink: '/programa/bachillerato' },
      ],
    },
    // { label: 'Admisiones', routerLink: '/admissions' }, // deshabilitada a pedido — la ruta '/admissions' ya no existe (ver app.routes.ts)
    { label: 'Eventos', routerLink: '/events' },
    { label: 'Noticias', routerLink: '/noticias' },
    {
      label: 'Vida Estudiantil',
      routerLink: '',
      hasDropdown: true,
      submenu: [
        { label: 'Nuestros Campus', routerLink: '/vida-estudiantil' },
        { label: 'Alumnos', routerLink: '/estudiantes/alumnos' },
        { label: 'Consejo Estudiantil', routerLink: '/consejo-estudiantil' },
      ],
    },
    {
      label: 'Servicios',
      routerLink: '',
      hasDropdown: true,
      submenu: [
        { label: 'Biblioteca UETS', routerLink: '/servicios/biblioteca' },
        { label: 'Instructivos', routerLink: '/servicios/instructivos' },
        { label: 'Repositorios', routerLink: '/servicios/repositorio' },
      ],
    },
    { label: 'Nosotros', routerLink: '/about' },
    { label: 'Contacto', routerLink: '/contact' },
  ],
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SuppressImageWarningDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentRoute = '';
  openDropdowns = new Set<number>();
  isMobileMenuOpen = false;
  openMobileDropdowns = new Set<number>();
  config: SiteHeaderConfig = DEFAULT_HEADER_CONFIG;

  get navItems(): NavItem[] {
    return this.config.navItems?.length ? this.config.navItems : DEFAULT_HEADER_CONFIG.navItems;
  }

  get logoUrl(): string {
    return this.normalizeLogoUrl(this.config.logoUrl);
  }

  constructor(
    private router: Router,
    private configPublica: ConfiguracionPublicaService,
  ) {}

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.configPublica.get<SiteHeaderConfig>('site_header', DEFAULT_HEADER_CONFIG).subscribe(config => {
      this.config = { ...DEFAULT_HEADER_CONFIG, ...config };
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
        this.closeDropdown();
      });
  }

  private normalizeLogoUrl(url?: string): string {
    const value = url?.trim();
    if (!value) return '';
    if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
    return `/${value.replace(/^\.?\//, '')}`;
  }

  isActive(route: string): boolean {
    // Si no hay ruta, no es activo
    if (!route) return false;
    
    // Si la ruta es '/', solo activo en home
    if (route === '/') {
      return this.currentRoute === '/';
    }
    
    // Para otras rutas, verificar que comience exactamente
    return this.currentRoute.startsWith(route);
  }

  openDropdownByIndex(index: number) {
    this.openDropdowns.add(index);
  }

  closeDropdownByIndex(index: number) {
    this.openDropdowns.delete(index);
  }

  closeDropdown() {
    this.openDropdowns.clear();
  }

  isDropdownOpen(index: number): boolean {
    return this.openDropdowns.has(index);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.openMobileDropdowns.clear();
  }

  toggleMobileDropdown(index: number) {
    if (this.openMobileDropdowns.has(index)) {
      this.openMobileDropdowns.delete(index);
    } else {
      this.openMobileDropdowns.add(index);
    }
  }

  isMobileDropdownOpen(index: number): boolean {
    return this.openMobileDropdowns.has(index);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const headerElement = (event.target as HTMLElement).closest('app-header');
    if (!headerElement && this.openDropdowns.size > 0) {
      this.closeDropdown();
    }
  }
}

