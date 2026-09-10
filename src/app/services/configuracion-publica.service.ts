/**
 * @file configuracion-publica.service.ts
 * @description Lee configuraciones públicas del backend (home, header, footer, etc.)
 * sin necesidad de autenticación. Usado por el frontend público.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfiguracionPublicaService {
  private readonly url = `${environment.apiUrl}/configuracion`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Lee una configuración pública por clave.
   * Si no existe en el backend, retorna el defaultValue.
   */
  get<T>(clave: string, defaultValue?: T): Observable<T> {
    return this.http
      .get<{ clave: string; datos: T }>(`${this.url}/publica/${clave}`, {
        params: { _t: Date.now().toString() },
      })
      .pipe(
        map(res => res.datos),
        catchError(err => {
          console.warn(`[ConfigPublica] Error al obtener '${clave}':`, err?.status, err?.message);
          return of(defaultValue as T);
        })
      );
  }
}
