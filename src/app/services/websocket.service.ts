/**
 * @file websocket.service.ts
 * @description Servicio que maneja la conexión WebSocket del frontend público.
 * Se suscribe a eventos de cambios en entidades y notifica a otros servicios.
 */
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WebSocketEvent {
  type: string;
  entidad: string;
  datos: any;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private socket: Socket | null = null;
  private readonly apiUrl = environment.apiUrl.replace('/api/v1', '');
  
  private eventSubject = new BehaviorSubject<WebSocketEvent | null>(null);
  event$ = this.eventSubject.asObservable();

  private isConnectedSubject = new BehaviorSubject(false);
  isConnected$ = this.isConnectedSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.socket = io(this.apiUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('✅ Conectado al servidor WebSocket');
        this.isConnectedSubject.next(true);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Desconectado del servidor WebSocket');
        this.isConnectedSubject.next(false);
      });

      // Suscribirse a eventos de cambios en entidades
      this.subscribeToEvents();
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
    }
  }

  private subscribeToEvents(): void {
    if (!this.socket) return;

    // Especialidades
    this.socket.on('especialidad:creado', (data) => this.emitEvent('especialidad:creado', data));
    this.socket.on('especialidad:actualizado', (data) => this.emitEvent('especialidad:actualizado', data));
    this.socket.on('especialidad:eliminado', (data) => this.emitEvent('especialidad:eliminado', data));

    // Noticias
    this.socket.on('noticia:creado', (data) => this.emitEvent('noticia:creado', data));
    this.socket.on('noticia:actualizado', (data) => this.emitEvent('noticia:actualizado', data));
    this.socket.on('noticia:eliminado', (data) => this.emitEvent('noticia:eliminado', data));

    // Eventos
    this.socket.on('evento:creado', (data) => this.emitEvent('evento:creado', data));
    this.socket.on('evento:actualizado', (data) => this.emitEvent('evento:actualizado', data));
    this.socket.on('evento:eliminado', (data) => this.emitEvent('evento:eliminado', data));

    // Autoridades
    this.socket.on('autoridad:creado', (data) => this.emitEvent('autoridad:creado', data));
    this.socket.on('autoridad:actualizado', (data) => this.emitEvent('autoridad:actualizado', data));
    this.socket.on('autoridad:eliminado', (data) => this.emitEvent('autoridad:eliminado', data));

    // Logros
    this.socket.on('logro:creado', (data) => this.emitEvent('logro:creado', data));
    this.socket.on('logro:actualizado', (data) => this.emitEvent('logro:actualizado', data));
    this.socket.on('logro:eliminado', (data) => this.emitEvent('logro:eliminado', data));

    // Recursos
    this.socket.on('recurso:creado', (data) => this.emitEvent('recurso:creado', data));
    this.socket.on('recurso:actualizado', (data) => this.emitEvent('recurso:actualizado', data));
    this.socket.on('recurso:eliminado', (data) => this.emitEvent('recurso:eliminado', data));

    // Configuración - Escuchar eventos de configuración dinámica
    this.socket.on('configuracion:hero:actualizada', (data) => {
      console.log('📢 Evento configuracion:hero:actualizada recibido:', data);
      this.emitEvent('configuracion:hero:actualizada', data);
    });
    this.socket.on('configuracion:stats:actualizada', (data) => {
      console.log('📢 Evento configuracion:stats:actualizada recibido:', data);
      this.emitEvent('configuracion:stats:actualizada', data);
    });
    this.socket.on('configuracion:footer:actualizada', (data) => {
      console.log('📢 Evento configuracion:footer:actualizada recibido:', data);
      this.emitEvent('configuracion:footer:actualizada', data);
    });
    this.socket.on('configuracion:home:actualizada', (data) => this.emitEvent('configuracion:home:actualizada', data));
    this.socket.on('configuracion:nosotros:actualizada', (data) => this.emitEvent('configuracion:nosotros:actualizada', data));
    this.socket.on('configuracion:estudiantes_page:actualizada', (data) => this.emitEvent('configuracion:estudiantes_page:actualizada', data));
    this.socket.on('configuracion:site_header:actualizada', (data) => this.emitEvent('configuracion:site_header:actualizada', data));
    this.socket.on('configuracion:site_footer:actualizada', (data) => this.emitEvent('configuracion:site_footer:actualizada', data));
  }

  private emitEvent(type: string, datos: any): void {
    const event: WebSocketEvent = { type, entidad: type.split(':')[0], datos };
    console.log('📢 Evento WebSocket:', event);
    this.eventSubject.next(event);
  }

  on(event: string): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on(event, (data) => observer.next(data));
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
