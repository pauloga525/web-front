import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-preventive-system',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preventive-system.component.html',
  styleUrl: './preventive-system.component.css'
})
export class PreventiveSystemComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  sectionTitle       = 'Sistema Preventivo Salesiano';
  sectionSubtitle    = '"Razón, Religión y Amor"';
  sectionDescription = 'Nuestro modelo pedagógico se fundamenta en la herencia de Don Bosco, creando un ambiente de familia donde la educación es cosa del corazón.';
  sectionImage       = '';

  features: Feature[] = [
    { title: 'Formación Integral',  description: 'Desarrollo académico y espiritual.', icon: 'school'    },
    { title: 'Acompañamiento',      description: 'Presencia cercana y orientadora.',   icon: 'handshake' },
    { title: 'Valores Cristianos',  description: 'Buenos cristianos y honrados ciudadanos.', icon: 'favorite' },
    { title: 'Comunidad',           description: 'Ambiente de familia y alegría.',     icon: 'groups'    }
  ];

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.configService.get<any>('home', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => this.applyInstitucional(config?.institucional));

    this.websocket.on('configuracion:home:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.configService.get<any>('home', {})
          .pipe(take(1), takeUntil(this.destroy$))
          .subscribe(config => this.applyInstitucional(config?.institucional));
      });
  }

  private applyInstitucional(inst: any): void {
    if (!inst) return;
    if (inst.titulo)    this.sectionTitle       = inst.titulo;
    if (inst.subtitulo) this.sectionSubtitle    = inst.subtitulo;
    if (inst.descripcion) this.sectionDescription = inst.descripcion;
    if (inst.imagen)    this.sectionImage       = inst.imagen;
    if (inst.caracteristicas?.length) {
      this.features = inst.caracteristicas.map((c: any) => ({
        title:       c.texto,
        description: '',
        icon:        'check_circle',
      }));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
