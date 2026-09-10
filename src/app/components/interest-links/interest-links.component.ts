import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuppressImageWarningDirective } from '../../directives/suppress-image-warning.directive';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

interface Link {
  name: string;
  href: string;
  image?: string;
}

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

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.configService.get<any>('home', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        if (config?.enlacesInteres?.length) {
          this.links = this.mapEnlaces(config.enlacesInteres);
        }
      });

    this.websocket.on('configuracion:home:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.configService.get<any>('home', {})
          .pipe(take(1))
          .subscribe(config => {
            if (config?.enlacesInteres?.length) {
              this.links = this.mapEnlaces(config.enlacesInteres);
            }
          });
      });
  }

  private mapEnlaces(items: any[]): Link[] {
    return items.map((l: any) => ({
      name:  l.nombre,
      href:  l.url || '#',
      image: l.imagen || '',
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
