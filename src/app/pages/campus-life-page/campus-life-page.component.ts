import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { SuppressImageWarningDirective } from '../../directives/suppress-image-warning.directive';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';

interface CampusCaracteristica { id: number; icon: string; label: string; }

interface CampusItem {
  id:               number;
  nombre:           string;
  badge:            string;
  descripcion:      string;
  imagenPrincipal:  string;
  imagenSecundaria1: string;
  imagenSecundaria2: string;
  caracteristicas:  CampusCaracteristica[];
  ubicacion:        string;
  mapaImagen:       string;
  mapaUrl:          string;
}

interface Plataforma { id: number; name: string; image: string; url: string; }

interface CampusConfig {
  heroTitulo:            string;
  heroSubtitulo:         string;
  heroImagen:            string;
  campus:                CampusItem[];
  plataformasTitulo:     string;
  plataformasDescripcion: string;
}

const DEFAULT_CONFIG: CampusConfig = {
  heroTitulo:            'Nuestros Campus',
  heroSubtitulo:         'Espacios diseñados para el aprendizaje, la innovación y el desarrollo integral de nuestra comunidad.',
  heroImagen:            '',
  campus:                [],
  plataformasTitulo:     'Nuestras Plataformas',
  plataformasDescripcion: 'Herramientas digitales que potencian tu aprendizaje',
};

@Component({
  selector: 'app-campus-life-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, BreadcrumbComponent, SuppressImageWarningDirective],
  templateUrl: './campus-life-page.component.html',
  styleUrl: './campus-life-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CampusLifePageComponent implements OnInit, OnDestroy {
  config: CampusConfig = DEFAULT_CONFIG;
  plataformas: Plataforma[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.loadConfig();

    this.websocket.on('configuracion:campus:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => this.applyConfig(data?.datos ?? data));

    this.configService.get<Plataforma[]>('plataformas', [])
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.plataformas = Array.isArray(list) ? list.filter(p => p.image) : [];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadConfig(): void {
    this.configService.get<Partial<CampusConfig>>('campus', DEFAULT_CONFIG)
      .pipe(takeUntil(this.destroy$))
      .subscribe(cfg => this.applyConfig(cfg));
  }

  private applyConfig(cfg?: Partial<CampusConfig>): void {
    this.config = { ...DEFAULT_CONFIG, ...cfg, campus: cfg?.campus ?? [] };
  }

  openMap(url: string): void {
    if (url) window.open(url, '_blank');
  }
}
