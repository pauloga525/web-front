import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Pillar {
  title: string;
  value: string;
  icon: string;
}


@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  stats: Pillar[] = [
    { title: 'Estudiantes', value: '+2.450', icon: 'group' },
    { title: 'Campus', value: '3', icon: 'location_city' },
    { title: 'Docentes', value: '180', icon: 'person' },
    { title: 'Años de Historia', value: '25', icon: 'history' }
  ];

  pillars: Pillar[] = [
    { 
      title: 'Bilingüe', 
      icon: 'translate',
      value: 'Programa intensivo de inglés con certificaciones internacionales'
    },
    { 
      title: 'Innovación', 
      icon: 'lightbulb',
      value: 'Aulas inteligentes y laboratorios modernos'
    },
    { 
      title: 'Valores Salesianos', 
      icon: 'favorite',
      value: 'Educación humanista integral'
    },
    { 
      title: 'Inserción Laboral', 
      icon: 'work',
      value: '95% de empleabilidad en egresados'
    }
  ];

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.configService.get<any>('home', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: config => {
          if (config?.estadisticas?.length) {
            this.stats = config.estadisticas.map((e: any) => ({
              title: e.etiqueta,
              value: e.valor,
              icon:  e.icono || '',
            }));
          }
          if (config?.porQue?.length) {
            this.pillars = config.porQue.map((item: any) => ({
              title: item.titulo,
              value: item.descripcion,
              icon:  this.mapIcon(item.icono),
            }));
          }
        },
        error: err => console.error('[Stats] Error en config:', err),
      });

    this.websocket.on('configuracion:home:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const estadisticas = data?.datos?.estadisticas;
        if (estadisticas?.length) {
          this.stats = estadisticas.map((e: any) => ({
            title: e.etiqueta,
            value: e.valor,
            icon:  e.icono || '',
          }));
        }
        const porQue = data?.datos?.porQue;
        if (porQue?.length) {
          this.pillars = porQue.map((item: any) => ({
            title: item.titulo,
            value: item.descripcion,
            icon:  this.mapIcon(item.icono),
          }));
        }
      });
  }

  private mapIcon(key: string): string {
    const map: Record<string, string> = {
      book: 'book', gear: 'settings', users: 'group', computer: 'computer',
      robot: 'smart_toy', chip: 'memory', terminal: 'terminal', wrench: 'build',
      factory: 'factory', hammer: 'hardware', car: 'directions_car',
      engine: 'engineering', bolt: 'bolt', plug: 'power', battery: 'battery_full',
      clipboard: 'assignment', atom: 'science', microscope: 'biotech',
    };
    return map[key] || 'star';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
