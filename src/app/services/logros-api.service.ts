import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

export interface LogroApi {
  _id: string;
  badge: string;
  badgeClass: string;
  date: string;
  title: string;
  category: string;
  description: string;
  image: string;
  featured: boolean;
  publicado: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class LogrosApiService {
  private readonly url = `${environment.apiUrl}/logros`;

  private _logros = new BehaviorSubject<LogroApi[]>([]);
  logros$ = this._logros.asObservable();

  constructor(private http: HttpClient, private websocket: WebsocketService) {
    this.cargar();

    this.websocket.event$.subscribe(event => {
      if (event?.entidad === 'logro') {
        this.cargar();
      }
    });
  }

  cargar(): void {
    this.http.get<LogroApi[]>(`${this.url}/publicos`).pipe(
      catchError(() => of([] as LogroApi[]))
    ).subscribe(lista => this._logros.next(lista));
  }

  getAll(): LogroApi[] { return this._logros.value; }

  getFeatured(): Observable<LogroApi[]> {
    return this.http.get<LogroApi[]>(`${this.url}/destacados`).pipe(
      catchError(() => of([] as LogroApi[]))
    );
  }

  getByCategory(category: string): Observable<LogroApi[]> {
    return this.http.get<LogroApi[]>(`${this.url}/categoria/${encodeURIComponent(category)}`).pipe(
      catchError(() => of([] as LogroApi[]))
    );
  }

  getById(id: string): Observable<LogroApi> {
    return this.http.get<LogroApi>(`${this.url}/publico/${id}`);
  }

  getCategories(): string[] {
    const cats = new Set(this._logros.value.map(l => l.category).filter(Boolean));
    return ['Todos', ...Array.from(cats)];
  }
}
