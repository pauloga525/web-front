import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebsocketService } from './websocket.service';

export interface MiembroConsejoApi {
  _id: string;
  titulo: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  publicado: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ConsejoApiService {
  private readonly url = `${environment.apiUrl}/consejo`;

  private _miembros = new BehaviorSubject<MiembroConsejoApi[]>([]);
  miembros$ = this._miembros.asObservable();

  constructor(private http: HttpClient, private websocket: WebsocketService) {
    this.cargar();

    this.websocket.event$.subscribe(event => {
      if (event?.entidad === 'consejo') {
        this.cargar();
      }
    });
  }

  cargar(): void {
    this.http.get<MiembroConsejoApi[]>(`${this.url}/publicos`).pipe(
      catchError(() => of([] as MiembroConsejoApi[]))
    ).subscribe(lista => this._miembros.next(lista));
  }
}
