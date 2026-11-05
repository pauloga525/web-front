import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventosApiService, EventoApi } from '../../services/eventos-api.service';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  events: Event[] = [];
  sectionTitle = 'PRÓXIMOS EVENTOS';
  btnLabel = 'Ver más eventos';
  btnUrl = '/events';

  constructor(
    private readonly eventosApi: EventosApiService,
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  ngOnInit() {
    this.eventosApi.eventos$.subscribe(lista => {
      // Solo eventos que aún no terminan, del más próximo al más lejano.
      // El primero es el principal; cuando pasa su fecha/hora sale solo.
      const ahora = new Date();
      this.events = lista
        .filter(e => this.finEvento(e) >= ahora)
        .sort((a, b) => this.inicioEvento(a).getTime() - this.inicioEvento(b).getTime())
        .slice(0, 3)
        .map(e => ({
          id:          e.slug || e._id,
          title:       e.titulo,
          date:        e.fecha,
          description: e.descripcionCorta,
          image:       e.imagenPrincipal,
        }));
    });

    this.configService.get<any>('home', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => this.applyEventosConfig(config?.eventos));

    this.websocket.on('configuracion:home:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => this.applyEventosConfig(data?.datos?.eventos));
  }

  private inicioEvento(e: EventoApi): Date {
    return new Date(`${e.fecha}T${e.horaInicio || '00:00'}:00`);
  }

  private finEvento(e: EventoApi): Date {
    return new Date(`${e.fecha}T${e.horaFin || '23:59'}:00`);
  }

  private applyEventosConfig(eventos: any): void {
    if (!eventos) return;
    if (eventos.tituloSeccion)     this.sectionTitle = eventos.tituloSeccion;
    if (eventos.labelBotonVerMas)  this.btnLabel      = eventos.labelBotonVerMas;
    if (eventos.urlBotonVerMas)    this.btnUrl        = eventos.urlBotonVerMas;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
