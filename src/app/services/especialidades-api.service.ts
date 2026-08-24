/**
 * @file especialidades-api.service.ts
 * @description Consume el endpoint público de especialidades del backend UETS.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

export interface MallaAnio {
  anio: string;
  asignaturas: string[];
}

export interface Especialidad {
  _id?: string;
  id?: string;
  nombre?: string;
  slug?: string;
  icono?: string;
  color?: string;
  color_primario?: string;
  color_secundario?: string;
  codigo?: string;
  titulo?: string;
  subtitulo?: string;
  descripcion?: string;
  descripcion_perfil?: string;
  tituloAObtener?: string;
  duracion?: string;
  nivel?: string;
  modalidad?: string;
  imagen?: string;
  imagenHero?: string;
  imagenSecundaria?: string;
  video_url?: string;
  videoUrl?: string;
  malla_curricular?: MallaAnio[];
  malla?: any[];
  coordinador?: string;
  perfilCoordinador?: any;
  perfil_estudiante?: string;
  perfilEstudiante?: any;
  oportunidades_futuro?: string[];
  salidasProfesionales?: any[];
  instalaciones?: Array<string | { id?: string; url?: string; titulo?: string; [key: string]: any }>;
  admisiones?: any;
  testimonios?: any[];
  publicacion?: { publicado: boolean; fechaPublicacion?: string; visibleEnWeb?: boolean };
  createdAt?: string;
  updatedAt?: string;
}

// Mantener compatibilidad con nombre anterior
export type EspecialidadApi = Especialidad;

@Injectable({ providedIn: 'root' })
export class EspecialidadesApiService {
  private readonly url = `${environment.apiUrl}/especialidades`;

  private _especialidades = new BehaviorSubject<Especialidad[]>([]);
  especialidades$ = this._especialidades.asObservable();

  constructor(private http: HttpClient, private websocket: WebsocketService) {
    this.cargar();

    this.websocket.event$.subscribe(event => {
      if (event?.entidad === 'especialidad') {
        this.cargar();
      }
    });
  }

  cargar(): void {
    this.http.get<Especialidad[]>(`${this.url}/publicas`).pipe(
      catchError(() => of([] as Especialidad[]))
    ).subscribe(lista => this._especialidades.next(lista));
  }

  /**
   * Obtiene todas las especialidades públicas
   */
  getAllEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.url}/publicas`).pipe(
      tap(especialidades => this._especialidades.next(especialidades)),
      catchError(() => of([] as Especialidad[]))
    );
  }

  getAll(): Especialidad[] {
    return this._especialidades.value;
  }

  getById(id: string): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.url}/publicas/${id}`).pipe(
      catchError(() => of({} as Especialidad))
    );
  }

  /**
   * Busca una especialidad por slug o por nombre similar
   */
  getBySlug(slug: string): Observable<Especialidad | undefined> {
    return this.http.get<Especialidad[]>(`${this.url}/publicas`).pipe(
      map(especialidades => 
        especialidades.find(e =>
          (e.slug === slug) ||
          (e.nombre?.toLowerCase().replace(/\s+/g, '-') === slug) ||
          (e.titulo?.toLowerCase().replace(/\s+/g, '-') === slug)
        )
      ),
      catchError(() => of(undefined))
    );
  }
}
