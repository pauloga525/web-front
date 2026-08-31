import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

export interface UniformeImagenApi {
  url: string;
  alt: string;
}

export interface UniformeApi {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  availability: string;
  images: UniformeImagenApi[];
  publicado: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class UniformesApiService {
  private readonly url = `${environment.apiUrl}/uniformes`;

  private _uniformes = new BehaviorSubject<UniformeApi[]>([]);
  uniformes$ = this._uniformes.asObservable();

  constructor(private http: HttpClient, private websocket: WebsocketService) {
    this.cargar();

    this.websocket.event$.subscribe(event => {
      if (event?.entidad === 'uniforme') {
        this.cargar();
      }
    });
  }

  cargar(): void {
    this.http.get<UniformeApi[]>(`${this.url}/publicos`).pipe(
      catchError(() => of([] as UniformeApi[]))
    ).subscribe(lista => this._uniformes.next(lista));
  }

  getAll(): UniformeApi[] { return this._uniformes.value; }

  getPublicos(): Observable<UniformeApi[]> {
    return this.http.get<UniformeApi[]>(`${this.url}/publicos`).pipe(
      catchError(() => of([] as UniformeApi[]))
    );
  }
}
