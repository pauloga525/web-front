import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface HeroConfig {
  titulo?: string;
  etiqueta?: string;
  textoDestacado?: string;
  descripcion?: string;
  video_url?: string;
  imagen_fallback?: string;
  botones?: Array<{
    texto: string;
    ruta: string;
    estilo: 'primary' | 'secondary';
  }>;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Valores por defecto (sin imagen fija — se carga desde configuración del admin)
  hero: HeroConfig = {
    titulo:         'Formando líderes del futuro',
    etiqueta:       'Unidad Educativa Técnica Salesiana',
    textoDestacado: 'Excelencia académica y técnica',
    descripcion:    'Formamos líderes íntegros con visión global, pensamiento crítico y valores sólidos en un entorno innovador y bilingüe.',
    imagen_fallback: undefined,
    botones: [
      { texto: 'Postula Ahora', ruta: '#', estilo: 'primary' },
      { texto: 'Calendario',    ruta: '/calendar', estilo: 'secondary' }
    ]
  };

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  private applyHeroData(heroData: any): void {
    if (!heroData) return;
    if (heroData.titulo)         this.hero.titulo         = heroData.titulo;
    if (heroData.etiqueta)       this.hero.etiqueta       = heroData.etiqueta;
    if (heroData.textoDestacado) this.hero.textoDestacado = heroData.textoDestacado;
    if (heroData.descripcion)    this.hero.descripcion    = heroData.descripcion;
    // Siempre sincronizar imagen_fallback desde el backend (si está vacía, no mostrar imagen)
    const rawUrl = heroData.imagenFondo || '';
    this.hero.imagen_fallback = rawUrl ? this.normalizeGridfsUrl(rawUrl) : undefined;
    if (heroData.botones?.length) {
      this.hero.botones = heroData.botones.map((b: any) => ({
        texto:  b.label,
        ruta:   b.url,
        estilo: b.estilo === 'primary' ? 'primary' : 'secondary',
      }));
    }
  }

  isVideoUrl(url: string): boolean {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
  }

  private normalizeGridfsUrl(url: string): string {
    if (!url?.includes('/api/v1/imagenes/gridfs/')) return url;
    const id = url.split('/api/v1/imagenes/gridfs/').pop();
    return `${environment.apiUrl}/imagenes/gridfs/${id}`;
  }

  ngOnInit(): void {
    this.configService.get<any>('home', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => this.applyHeroData(config?.hero));

    this.websocket.on('configuracion:home:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.configService.get<any>('home', {})
          .pipe(take(1), takeUntil(this.destroy$))
          .subscribe(config => this.applyHeroData(config?.hero));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
