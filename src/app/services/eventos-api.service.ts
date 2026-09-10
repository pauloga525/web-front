/**
 * @file eventos-api.service.ts
 * @description Consume el endpoint público de eventos del backend UETS.
 * Reemplaza el EventService basado en localStorage.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

export interface AgendaItemApi {
  id: number;
  hora: string;
  titulo: string;
  descripcion?: string;
}

export interface RegistroAsistenciaApi {
  habilitado: boolean;
  labelBoton: string;
  url?: string;
}

export interface EventoApi {
  _id: string;
  slug: string;
  titulo: string;
  descripcionCorta: string;
  descripcionCompleta: string;
  categoria: string;
  categoriaColor: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  ubicacion: string;
  direccion?: string;
  imagenPrincipal: string;
  galeria?: string[];
  agenda?: AgendaItemApi[];
  registro?: RegistroAsistenciaApi;
  publicado: boolean;
  destacado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventosPaginadosApi {
  items: EventoApi[];
  total: number;
}

export interface FiltroEventosApi {
  q?: string;
  categoria?: string;
  mes?: number;
  anio?: number;
  pagina?: number;
  porPagina?: number;
}

@Injectable({ providedIn: 'root' })
export class EventosApiService {
  private readonly url = `${environment.apiUrl}/eventos`;

  private readonly _eventos = new BehaviorSubject<EventoApi[]>([]);
  eventos$ = this._eventos.asObservable();

  constructor(private readonly http: HttpClient, private readonly websocket: WebsocketService) {
    this.cargar();

    this.websocket.event$.subscribe(event => {
      if (event?.entidad === 'evento') {
        this.cargar();
      }
    });
  }

  cargar(): void {
    this.filtrar({ porPagina: 500 }).pipe(
      catchError(() => of({ items: [], total: 0 } as EventosPaginadosApi))
    ).subscribe(res => this._eventos.next(res.items));
  }

  getAll(): EventoApi[] { return this._eventos.value; }

  getBySlug(slug: string): Observable<EventoApi> {
    return this.http.get<EventoApi>(`${this.url}/slug/${slug}`);
  }

  getById(id: string): Observable<EventoApi> {
    return this.http.get<EventoApi>(`${this.url}/slug/${id}`).pipe(
      catchError(() => this.http.get<EventoApi>(`${this.url}/slug/${id}`))
    );
  }

  getDestacado(): Observable<EventoApi | null> {
    return this.http.get<EventoApi>(`${this.url}/destacado`).pipe(
      catchError(() => of(null))
    );
  }

  filtrar(params: FiltroEventosApi): Observable<EventosPaginadosApi> {
    let p = new HttpParams();
    if (params.q)         p = p.set('q', params.q);
    if (params.categoria) p = p.set('categoria', params.categoria);
    if (params.mes)       p = p.set('mes', String(params.mes));
    if (params.anio)      p = p.set('anio', String(params.anio));
    if (params.pagina)    p = p.set('pagina', String(params.pagina));
    if (params.porPagina) p = p.set('porPagina', String(params.porPagina));
    return this.http.get<EventosPaginadosApi>(`${this.url}/publicos`, { params: p }).pipe(
      catchError(() => of({ items: [], total: 0 } as EventosPaginadosApi))
    );
  }
}
