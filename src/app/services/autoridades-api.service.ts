/**
 * @file autoridades-api.service.ts
 * @description Consume el endpoint público de autoridades del backend UETS.
 * Reemplaza el AuthorityService con datos hardcodeados.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

export interface AutoridadApi {
  _id: string;
  name: string;
  title: string;
  categoryLabel: string;
  image: string;
  email: string;
  specialization: string;
  linkedin: string;
  fullBio: string;
  ubicacion: string;
  horario: string;
  telefono: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AutoridadesApiService {
  private readonly url = `${environment.apiUrl}/autoridades`;

  private readonly _autoridades = new BehaviorSubject<AutoridadApi[]>([]);
  autoridades$ = this._autoridades.asObservable();

  constructor(private readonly http: HttpClient, private readonly websocket: WebsocketService) {
    this.cargar();

    this.websocket.event$.subscribe(event => {
      if (event?.entidad === 'autoridad') {
        this.cargar();
      }
    });
  }

  cargar(): void {
    this.http.get<AutoridadApi[]>(`${this.url}/publicas`).pipe(
      catchError(() => of([] as AutoridadApi[]))
    ).subscribe(lista => this._autoridades.next(lista));
  }

  getAll(): AutoridadApi[] { return this._autoridades.value; }

  getById(id: string): Observable<AutoridadApi> {
    return this.http.get<AutoridadApi>(`${this.url}/publica/${id}`);
  }
}
