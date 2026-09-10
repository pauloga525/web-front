import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

export interface NoticiaApi {
  _id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  destacada: boolean;
  category: string;
  featuredImage: string;
  author: string;
  authorImage: string;
  date: string;
  readTime: string;
  content: string;
  images: { id?: number; url: string; alt: string }[];
  tags: string[];
  publicada: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoticiasPaginadasApi {
  items: NoticiaApi[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface FiltroNoticiasApi {
  q?: string;
  categoria?: string;
  pagina?: number;
  porPagina?: number;
}

@Injectable({ providedIn: 'root' })
export class NoticiasApiService {
  private readonly url = `${environment.apiUrl}/noticias`;

  private readonly _noticias = new BehaviorSubject<NoticiaApi[]>([]);
  noticias$ = this._noticias.asObservable();

  constructor(private readonly http: HttpClient, private readonly websocket: WebsocketService) {
    this.cargar();

    this.websocket.event$.subscribe(event => {
      if (event?.entidad === 'noticia') {
        this.cargar();
      }
    });
  }

  cargar(): void {
    this.http.get<any>(`${this.url}/publicas`).pipe(
      catchError(() => of({ items: [] }))
    ).subscribe(res => {
      const lista: NoticiaApi[] = Array.isArray(res) ? res : (res?.items ?? []);
      this._noticias.next(lista);
    });
  }

  filtrar(params: FiltroNoticiasApi): Observable<NoticiasPaginadasApi> {
    let p = new HttpParams();
    if (params.q)         p = p.set('q', params.q);
    if (params.categoria) p = p.set('categoria', params.categoria);
    if (params.pagina)    p = p.set('pagina', String(params.pagina));
    if (params.porPagina) p = p.set('porPagina', String(params.porPagina));
    return this.http.get<NoticiasPaginadasApi>(`${this.url}/publicas`, { params: p }).pipe(
      catchError(() => of({ items: [], total: 0, pagina: 1, porPagina: 10, totalPaginas: 0 }))
    );
  }

  getAll(): NoticiaApi[] { return this._noticias.value; }

  getById(id: string): Observable<NoticiaApi> {
    return this.http.get<NoticiaApi>(`${this.url}/publica/${id}`);
  }

  getDestacadas(): Observable<NoticiaApi[]> {
    return this.http.get<NoticiaApi[]>(`${this.url}/destacadas`).pipe(
      catchError(() => of([] as NoticiaApi[]))
    );
  }
}
