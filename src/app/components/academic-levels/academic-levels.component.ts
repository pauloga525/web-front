import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface AcademicLevel {
  name: string;
  icon: string;
  description: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-academic-levels',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './academic-levels.component.html',
  styleUrl: './academic-levels.component.css'
})
export class AcademicLevelsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  levels: AcademicLevel[] = [];

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.configService.get<any>('home', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        if (config?.niveles?.length) {
          this.levels = this.mapNiveles(config.niveles);
        }
      });

    this.websocket.on('configuracion:home:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const niveles = data?.datos?.niveles;
        if (niveles?.length) {
          this.levels = this.mapNiveles(niveles);
        }
      });
  }

  private mapNiveles(niveles: any[]): AcademicLevel[] {
    return niveles.map((n: any) => ({
      name:        n.nombre,
      icon:        'school',
      description: n.descripcion,
      image:       n.imagen || '/image/bachillerato/Bachillerato.png',
      route:       n.enlace || '/',
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
