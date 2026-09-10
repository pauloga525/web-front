import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SuppressImageWarningDirective } from '../../directives/suppress-image-warning.directive';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface FooterLink  { label: string; href: string; }
interface SocialLink  { name: string; href: string; icon: string; }

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, SuppressImageWarningDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  isMapModalOpen      = false;
  isComingSoonModalOpen = false;
  mapUrl: SafeResourceUrl;

  logoUrl  = '';
  logoAlt  = 'Logo UETS';
  descripcion    = 'Educar es nuestra pasión, la excelencia nuestra meta. Una institución comprometida con el desarrollo integral de la juventud ecuatoriana.';
  quickLinksTitulo = 'Enlaces Rápidos';
  copyright        = '';

  private readonly destroy$ = new Subject<void>();

  socialLinks: SocialLink[] = [
    { name: 'Facebook',  href: 'https://www.facebook.com/uetscuenca',                               icon: 'facebook'  },
    { name: 'Instagram', href: 'https://www.instagram.com/uetscuenca',                              icon: 'instagram' },
    { name: 'Twitter',   href: 'https://x.com/uetscue',                                             icon: 'twitter'   },
    { name: 'YouTube',   href: 'https://www.youtube.com/c/UET%C3%A9cnicoSalesiano',                 icon: 'youtube'   },
    { name: 'TikTok',    href: 'https://www.tiktok.com/@uetscuenca',                                icon: 'tiktok'    },
    { name: 'Spotify',   href: 'https://open.spotify.com/intl-es/artist/5gLwRDP95HalLhHv7P6eeC',  icon: 'spotify'   },
  ];

  quickLinks: FooterLink[] = [
    { label: 'Calendario Académico',  href: '/calendar'              },
    { label: 'Lista de Útiles',       href: '#'                      },
    { label: 'Uniformes Escolares',   href: '/estudiantes/uniformes' },
    { label: 'Bolsa de Empleo',       href: '#'                      },
    { label: 'Transparencia',         href: '#'                      },
  ];

  footerLinks: FooterLink[] = [
    { label: 'Privacidad', href: '#' },
    { label: 'Términos',   href: '#' },
    { label: 'Cookies',    href: '#' },
  ];

  contact = {
    address:  'Av. Don Bosco y Felipe II',
    phone1:   '072-814-274',
    phone2:   '072-882-606',
    email:    'uets@uets.edu.ec',
    map:      '',
    mapEmbed: 'https://maps.app.goo.gl/ZeSrHEXjtbyvXZX47',
  };

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.openstreetmap.org/export/embed.html?bbox=-79.0214698,-2.9215462,-79.0114698,-2.9115462&layer=mapnik&marker=-2.9165462,-79.0164698&zoom=17'
    );
  }

  ngOnInit(): void {
    // Fuente principal: site_footer
    this.configService.get<any>('site_footer', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(cfg => this.applyConfig(cfg));

    // Logo también desde site_header como fallback
    this.configService.get<any>('site_header', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(cfg => {
        if (!this.logoUrl && cfg?.logoUrl) this.logoUrl = cfg.logoUrl;
        if (!this.logoAlt && cfg?.logoAlt) this.logoAlt = cfg.logoAlt;
      });

    // Actualizaciones en tiempo real
    this.websocket.on('configuracion:site_footer:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => this.applyConfig(data?.datos ?? data));

    this.websocket.on('configuracion:site_header:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const cfg = data?.datos ?? data;
        if (cfg?.logoUrl) this.logoUrl = cfg.logoUrl;
        if (cfg?.logoAlt) this.logoAlt = cfg.logoAlt;
      });
  }

  private applyConfig(cfg: any): void {
    if (!cfg) return;
    this.applyTextFields(cfg);
    this.applyContactFields(cfg);
    this.applyLinkLists(cfg);
  }

  private applyTextFields(cfg: any): void {
    if (cfg.logoUrl  !== undefined) this.logoUrl  = cfg.logoUrl;
    if (cfg.logoAlt)                this.logoAlt  = cfg.logoAlt;
    if (cfg.descripcion)            this.descripcion     = cfg.descripcion;
    if (cfg.quickLinksTitulo)       this.quickLinksTitulo = cfg.quickLinksTitulo;
    if (cfg.copyright)              this.copyright       = cfg.copyright;
  }

  private applyContactFields(cfg: any): void {
    if (cfg.direccion)  this.contact.address  = cfg.direccion;
    if (cfg.telefono1)  this.contact.phone1   = cfg.telefono1;
    if (cfg.telefono2)  this.contact.phone2   = cfg.telefono2;
    if (cfg.email)       this.contact.email    = cfg.email;
    if (cfg.mapaImagen) this.contact.map      = cfg.mapaImagen;
    if (cfg.mapaUrl)     this.contact.mapEmbed = cfg.mapaUrl;
  }

  private applyLinkLists(cfg: any): void {
    if (Array.isArray(cfg.redes) && cfg.redes.length) {
      this.socialLinks = cfg.redes
        .filter((r: any) => r.href)
        .map((r: any) => ({ name: r.label, href: r.href, icon: r.icon }));
    }
    if (Array.isArray(cfg.quickLinks) && cfg.quickLinks.length) {
      this.quickLinks = cfg.quickLinks.map((l: any) => ({ label: l.label, href: l.href }));
    }
    if (Array.isArray(cfg.footerLinks) && cfg.footerLinks.length) {
      this.footerLinks = cfg.footerLinks.map((l: any) => ({ label: l.label, href: l.href }));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openMapModal():       void { this.isMapModalOpen       = true;  }
  closeMapModal():      void { this.isMapModalOpen       = false; }
  openComingSoonModal():  void { this.isComingSoonModalOpen = true;  }
  closeComingSoonModal(): void { this.isComingSoonModalOpen = false; }
}
