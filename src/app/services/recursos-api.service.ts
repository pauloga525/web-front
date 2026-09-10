/**
 * @file recursos-api.service.ts
 * @description Consume el endpoint público de recursos del backend UETS.
 * Usado por biblioteca, instructivos, repositorio y uniformes.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface RecursoApi {
  _id: string;
  titulo: string;
  descripcion: string;
  url: string;
  tipo: string;
  categoria: string;
  publicado: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class RecursosApiService {
  private readonly url = `${environment.apiUrl}/recursos`;

  constructor(private readonly http: HttpClient) {}

  getByCategoria(categoria: string): Observable<RecursoApi[]> {
    const params = new HttpParams().set('categoria', categoria);
    return this.http.get<RecursoApi[]>(`${this.url}/publicos`, { params }).pipe(
      catchError(() => of([] as RecursoApi[]))
    );
  }

  getAll(): Observable<RecursoApi[]> {
    return this.http.get<RecursoApi[]>(`${this.url}/publicos`).pipe(
      catchError(() => of([] as RecursoApi[]))
    );
  }
}
