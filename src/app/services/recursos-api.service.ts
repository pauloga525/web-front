/**
 * @file recursos-api.service.ts
 * @description Consume el endpoint público de recursos del backend UETS.
 * Usado por biblioteca e instructivos (distinguidos por el campo `tipo`).
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface EnlaceRecurso {
  url: string;
  descripcion: string;
}

/** Una fila de una tabla de Boscómetro importada desde Excel. */
export interface FilaTablaBoscometro {
  valores: string[];
  esEncabezado: boolean;
}

/** Un punto (curso + total) de un gráfico de Boscómetro importado desde Excel. */
export interface PuntoGraficoBoscometro {
  curso: string;
  total: number;
}

export interface RecursoApi {
  _id: string;
  titulo: string;
  descripcion: string;
  url: string;
  imagen: string;
  tipo: string;
  categoria: string;
  tags: string[];
  enlaces: EnlaceRecurso[];
  /** Solo presente en recursos tipo 'boscometro_tabla'. */
  filas?: FilaTablaBoscometro[];
  /** Solo presente en recursos tipo 'boscometro_grafico'. */
  datos?: PuntoGraficoBoscometro[];
  publicado: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class RecursosApiService {
  private readonly url = `${environment.apiUrl}/recursos`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<RecursoApi[]> {
    return this.http.get<RecursoApi[]>(`${this.url}/publicos`).pipe(
      catchError(() => of([] as RecursoApi[]))
    );
  }

  /** Solo los recursos publicados de los tipos indicados, ordenados por `orden`. */
  getByTipo(...tipos: string[]): Observable<RecursoApi[]> {
    return this.getAll().pipe(
      map(list => list.filter(r => tipos.includes(r.tipo)).sort((a, b) => a.orden - b.orden))
    );
  }
}
