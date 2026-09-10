import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

interface Resource {
  title: string;
  icon: string;
  imagen?: string;
  href: string;
}

@Component({
  selector: 'app-salesian-communication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesian-communication.component.html',
  styleUrl: './salesian-communication.component.css'
})
export class SalesianCommunicationComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  resources: Resource[] = [];

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.configService.get<any>('home', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        if (config?.comunicacion?.length) {
          this.resources = this.mapComunicacion(config.comunicacion);
        }
      });

    this.websocket.on('configuracion:home:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.configService.get<any>('home', {})
          .pipe(take(1))
          .subscribe(config => {
            if (config?.comunicacion?.length) {
              this.resources = this.mapComunicacion(config.comunicacion);
            }
          });
      });
  }

  private mapComunicacion(items: any[]): Resource[] {
    return items.map((item: any) => ({
      title:  item.nombre,
      icon:   'language',
      imagen: item.imagen || '',
      href:   item.url || '#',
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
