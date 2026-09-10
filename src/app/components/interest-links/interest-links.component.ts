import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuppressImageWarningDirective } from '../../directives/suppress-image-warning.directive';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Link {
  name: string;
  href: string;
  image?: string;
}

interface Plataforma {
  id: number;
  name: string;
  image: string;
  url: string;
}

/**
 * Antes esta sección leía 'home.enlacesInteres', una lista propia y
 * completamente separada de la de Campus/Repositorio (distinto esquema:
 * nombre/url/imagen en vez de name/url/image). Eran dos listas de logos
 * que un admin tenía que mantener sincronizadas a mano. Ahora usa la
 * misma lista compartida 'plataformas' que Campus y el Repositorio, para
 * que un solo lugar de edición (Campus → Plataformas) alimente los tres.
 */
@Component({
  selector: 'app-interest-links',
  standalone: true,
  imports: [CommonModule, SuppressImageWarningDirective],
  templateUrl: './interest-links.component.html',
  styleUrl: './interest-links.component.css'
})
export class InterestLinksComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  links: Link[] = [];
  // Mismo título que Campus, Repositorio, Biblioteca e Instructivos —
  // viene de la config 'campus' (plataformasTitulo), el único lugar
  // donde se edita.
  titulo = 'Enlaces de Interés';
  descripcion = '';

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.cargar();

    this.websocket.on('configuracion:plataformas:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cargar());
  }

  private cargar(): void {
    this.configService.get<{ plataformasTitulo?: string; plataformasDescripcion?: string }>('campus', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(cfg => {
        if (cfg?.plataformasTitulo) this.titulo = cfg.plataformasTitulo;
        if (cfg?.plataformasDescripcion) this.descripcion = cfg.plataformasDescripcion;
      });

    this.configService.get<Plataforma[]>('plataformas', [])
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        if (Array.isArray(list)) {
          this.links = list.filter(p => p.image).map(p => ({ name: p.name, href: p.url || '#', image: p.image }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
