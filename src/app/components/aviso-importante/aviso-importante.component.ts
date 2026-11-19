/**
 * @file aviso-importante.component.ts
 * @description Ventana emergente de "aviso importante" que se abre al entrar a la
 * portada. Se edita desde el panel (clave de configuración 'aviso_home'): imagen,
 * título, texto, botón con enlace, estilo y fechas de vigencia. Se abre cada vez que
 * se carga o se recarga la portada, y se cierra con la X, clic afuera o Escape.
 * Al cerrarla queda una mini tarjeta flotante abajo a la derecha (un botón redondo
 * en celular) que vuelve a abrir el aviso.
 */
import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, ViewChildren, QueryList, NgZone, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';

export interface AvisoHomeConfig {
  activo: boolean;
  imagenUrl: string;
  titulo: string;
  texto: string;
  botonTexto: string;
  enlace: string;
  /** yyyy-mm-dd; vacío = sin límite. */
  fechaInicio: string;
  fechaFin: string;
  /** Estilo visual. Si no viene (avisos guardados antes), se deduce del título. */
  tema?: 'general' | 'bingo';
}

interface BolaBingo { letra: string; numero: number; size: number; top: number; left: number; giro: number; retraso: number; clara?: boolean; }

const CLAVE = 'aviso_home';

@Component({
  selector: 'app-aviso-importante',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aviso-importante.component.html',
  styleUrl: './aviso-importante.component.css',
})
export class AvisoImportanteComponent implements OnInit, OnDestroy {
  private readonly configService = inject(ConfiguracionPublicaService);
  private readonly websocket = inject(WebsocketService);
  private readonly document = inject(DOCUMENT);
  private readonly destroy$ = new Subject<void>();

  @ViewChild('dialogo') dialogo?: ElementRef<HTMLElement>;
  @ViewChild('btnCerrar') btnCerrar?: ElementRef<HTMLButtonElement>;
  @ViewChild('btnRecordatorio') btnRecordatorio?: ElementRef<HTMLButtonElement>;
  @ViewChildren('orbitaPos') orbitaPos?: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('orbitaZona') orbitaZona?: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  /** Id del requestAnimationFrame de las bolas que rebotan (null = detenidas). */
  private rafId: number | null = null;

  aviso: AvisoHomeConfig | null = null;
  /** La ventana está en pantalla. */
  abierto = false;
  /** Se está reproduciendo la animación de salida. */
  cerrando = false;

  /** Ya se abrió en esta carga: evita que una actualización en vivo la reabra sola. */
  yaSeMostro = false;
  /** El visitante ocultó la mini tarjeta flotante (vuelve en la próxima carga). */
  recordatorioOculto = false;
  private focoPrevio: HTMLElement | null = null;
  private timerAbrir: ReturnType<typeof setTimeout> | null = null;
  private timerCerrar: ReturnType<typeof setTimeout> | null = null;

  /** Posiciones en % dentro del contenedor de bolas (escritorio). */
  readonly bolas: BolaBingo[] = [
    { letra: 'B', numero: 7,  size: 92,  top: 4,  left: 2,  giro: -12, retraso: 0 },
    { letra: 'I', numero: 22, size: 66,  top: 66, left: 6,  giro: 8,   retraso: 1.2 },
    { letra: 'N', numero: 41, size: 136, top: 22, left: 30, giro: -4,  retraso: 0.6, clara: true },
    { letra: 'G', numero: 53, size: 84,  top: 70, left: 68, giro: 10,  retraso: 1.8 },
    { letra: 'O', numero: 68, size: 78,  top: 0,  left: 74, giro: 14,  retraso: 2.4 },
  ];

  /**
   * Bolas que salen de detrás de la ventana al abrirla y luego rebotan por toda la
   * pantalla. x/y: dirección del primer salto; retraso: cuándo aparece cada una
   * (desigual a propósito, primero las grandes).
   */
  readonly orbita: { letra: string; numero: number; size: number; x: number; y: number; retraso: number; giro: number; clara?: boolean }[] = [
    { letra: 'B', numero: 12, size: 64, x: -560, y: -170, retraso: 160, giro: -14 },
    { letra: 'O', numero: 61, size: 70, x: 600,  y: 20,   retraso: 190, giro: 10 },
    { letra: 'G', numero: 49, size: 56, x: 530,  y: -210, retraso: 240, giro: 18, clara: true },
    { letra: 'N', numero: 33, size: 58, x: -490, y: 230,  retraso: 260, giro: 6 },
    { letra: 'I', numero: 27, size: 46, x: -630, y: 50,   retraso: 310, giro: -8, clara: true },
    { letra: 'B', numero: 3,  size: 46, x: 470,  y: 245,  retraso: 330, giro: -12 },
    { letra: 'N', numero: 44, size: 40, x: -170, y: -275, retraso: 380, giro: 12 },
    { letra: 'G', numero: 58, size: 42, x: 210,  y: 285,  retraso: 400, giro: -6 },
  ];

  /** Números del cartón decorativo de fondo (5 columnas B-I-N-G-O, 4 filas). */
  readonly carton: number[] = [
    3, 18, 34, 49, 62,
    11, 25, 38, 57, 71,
    6, 29, 44, 52, 65,
    14, 20, 31, 60, 74,
  ];

  get esBingo(): boolean {
    const a = this.aviso;
    if (!a) return false;
    return a.tema ? a.tema === 'bingo' : /bingo/i.test(a.titulo ?? '');
  }

  get visible(): boolean {
    const a = this.aviso;
    if (!a?.activo || !(a.titulo?.trim() || a.imagenUrl)) return false;
    const hoy = this.fechaLocal(new Date());
    if (a.fechaInicio && hoy < a.fechaInicio) return false;
    if (a.fechaFin && hoy > a.fechaFin) return false;
    return true;
  }

  /** Mini tarjeta flotante: visible cuando el aviso está vigente y la ventana cerrada. */
  get mostrarRecordatorio(): boolean {
    return this.visible && this.yaSeMostro && !this.abierto && !this.recordatorioOculto;
  }

  /** Enlaces que empiezan con "/" se abren dentro del sitio; el resto en otra pestaña. */
  get enlaceInterno(): boolean {
    return /^\/(?!\/)/.test(this.aviso?.enlace?.trim() ?? '');
  }

  ngOnInit(): void {
    this.cargar();
    this.websocket.on(`configuracion:${CLAVE}:actualizada`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cargar());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.timerAbrir) clearTimeout(this.timerAbrir);
    if (this.timerCerrar) clearTimeout(this.timerCerrar);
    this.detenerRebote();
    this.bloquearScroll(false);
  }

  /** Cierra la ventana (vuelve a abrirse en la próxima carga de la portada). */
  cerrar(): void {
    if (!this.abierto || this.cerrando) return;
    this.cerrando = true;
    this.timerCerrar = setTimeout(() => {
      this.abierto = false;
      this.cerrando = false;
      this.detenerRebote();
      this.bloquearScroll(false);
      // El foco pasa a la mini tarjeta (si existe) para que el teclado no se pierda.
      setTimeout(() => (this.btnRecordatorio?.nativeElement ?? this.focoPrevio)?.focus?.({ preventScroll: true }));
    }, 240);
  }

  /** Vuelve a abrir la ventana desde la mini tarjeta flotante. */
  abrir(): void {
    if (this.abierto || !this.visible) return;
    if (this.timerCerrar) clearTimeout(this.timerCerrar);
    this.cerrando = false;
    this.yaSeMostro = true;
    this.focoPrevio = this.document.activeElement as HTMLElement | null;
    this.abierto = true;
    this.bloquearScroll(true);
    this.alRenderizar(() => {
      this.btnCerrar?.nativeElement.focus({ preventScroll: true });
      this.iniciarRebote();
    });
  }

  /**
   * Angular puede pintar la ventana en el siguiente cuadro de animación, no al
   * instante. Espera a que la ventana exista en la página (máx. ~1 s) antes de
   * enfocar el botón y arrancar las bolas.
   */
  private alRenderizar(accion: () => void, intento = 0): void {
    setTimeout(() => {
      if (!this.abierto) return;
      if (this.dialogo || intento >= 60) { accion(); return; }
      this.alRenderizar(accion, intento + 1);
    }, intento ? 16 : 0);
  }

  /**
   * Física simple de las bolas de alrededor: salen del centro (detrás de la ventana),
   * caen con gravedad y rebotan contra el piso y los lados. Cuando un rebote pierde
   * fuerza reciben un nuevo impulso, así siguen saltando mientras la ventana esté
   * abierta. Corre fuera de Angular y mueve los elementos con transform (sin
   * detección de cambios ni recalcular el diseño de la página).
   */
  private iniciarRebote(): void {
    this.detenerRebote();
    const zona = this.orbitaZona?.nativeElement;
    const elementos = this.orbitaPos?.toArray().map(r => r.nativeElement) ?? [];
    if (!zona || !elementos.length) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const movil = zona.clientWidth < 640;
    const escala = movil ? 0.72 : 1;
    const g = 1700;                       // gravedad (px/s²)
    let ancho = zona.clientWidth;
    let alto = zona.clientHeight;
    const origenY = movil ? alto * 0.55 : alto * 0.5;
    const ahora0 = performance.now();

    const bolas = elementos.map((el, i) => {
      const o = this.orbita[i];
      const r = (o.size * escala) / 2;
      const dir = Math.hypot(o.x, o.y) || 1;
      const fuerza = (movil ? 650 : 1050) * (0.85 + Math.random() * 0.3);
      return {
        el, r,
        x: ancho / 2 - r,
        y: origenY - r,
        vx: (o.x / dir) * fuerza,
        vy: (o.y / dir) * fuerza - (movil ? 700 : 600),
        giro: o.giro,
        inicio: ahora0 + o.retraso,      // no se mueve hasta que aparece
      };
    });

    let previo = ahora0;
    const paso = (t: number) => {
      const dt = Math.min(Math.max((t - previo) / 1000, 0), 1 / 30);
      previo = t;
      ancho = zona.clientWidth;
      alto = zona.clientHeight;
      for (const b of bolas) {
        if (t >= b.inicio) {
          b.vy += g * dt;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          // Piso: rebota perdiendo algo de fuerza; si casi no sube, nuevo salto.
          if (b.y + 2 * b.r > alto) {
            b.y = alto - 2 * b.r;
            b.vy = -Math.abs(b.vy) * 0.8;
            if (Math.abs(b.vy) < 520) {
              b.vy = -Math.sqrt(2 * g * alto * (0.45 + Math.random() * 0.4));
              b.vx += (Math.random() - 0.5) * 260;
            }
          }
          if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy) * 0.6; }
          if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.9; }
          if (b.x + 2 * b.r > ancho) { b.x = ancho - 2 * b.r; b.vx = -Math.abs(b.vx) * 0.9; }
          // Velocidad horizontal mínima para que recorran toda la pantalla.
          if (Math.abs(b.vx) < 90) b.vx = (b.vx < 0 ? -1 : 1) * (90 + Math.random() * 120);
          b.giro += b.vx * dt * 0.9;
        }
        b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.giro}deg)`;
      }
      this.rafId = requestAnimationFrame(paso);
    };

    this.zone.runOutsideAngular(() => { this.rafId = requestAnimationFrame(paso); });
  }

  private detenerRebote(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  /** Oculta la mini tarjeta hasta la próxima carga de la página. */
  ocultarRecordatorio(event: Event): void {
    event.stopPropagation();
    this.recordatorioOculto = true;
  }

  /** Clic en el fondo oscuro (fuera de la tarjeta). */
  onFondo(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cerrar();
  }

  @HostListener('document:keydown', ['$event'])
  onTecla(event: KeyboardEvent): void {
    if (!this.abierto) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cerrar();
      return;
    }
    // Mantiene el foco del teclado dentro de la ventana mientras está abierta.
    if (event.key === 'Tab' && this.dialogo) {
      const focusables = Array.from(this.dialogo.nativeElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (!focusables.length) return;
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];
      const activo = this.document.activeElement;
      if (event.shiftKey && activo === primero) { event.preventDefault(); ultimo.focus(); }
      else if (!event.shiftKey && activo === ultimo) { event.preventDefault(); primero.focus(); }
    }
  }

  private cargar(): void {
    this.configService.get<AvisoHomeConfig | null>(CLAVE, null)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(cfg => {
        this.aviso = cfg && typeof cfg === 'object' ? cfg : null;
        if (!this.visible) {
          // Se desactivó o venció mientras estaba abierto: se retira sin marcarlo como visto.
          if (this.abierto) { this.abierto = false; this.bloquearScroll(false); }
          return;
        }
        if (!this.abierto && !this.yaSeMostro) this.programarApertura();
      });
  }

  private programarApertura(): void {
    if (this.timerAbrir) clearTimeout(this.timerAbrir);
    // Pequeña espera para que la portada se pinte antes de la ventana.
    this.timerAbrir = setTimeout(() => {
      this.abrir();
    }, 700);
  }

  private bloquearScroll(bloquear: boolean): void {
    this.document.body.style.overflow = bloquear ? 'hidden' : '';
  }

  private fechaLocal(d: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
}
