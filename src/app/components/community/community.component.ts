import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

interface Partner {
  name: string;
  logo: string;
  url: string;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  partners: Partner[] = [];

  constructor(
    private readonly configService: ConfiguracionPublicaService,
    private readonly websocket: WebsocketService
  ) {}

  ngOnInit(): void {
    this.configService.get<any>('home', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        if (config?.logos?.length) {
          this.partners = this.mapLogos(config.logos);
        }
      });

    this.websocket.on('configuracion:home:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.configService.get<any>('home', {})
          .pipe(take(1), takeUntil(this.destroy$))
          .subscribe(config => {
            this.partners = config?.logos?.length ? this.mapLogos(config.logos) : [];
          });
      });
  }

  private mapLogos(logos: any[]): Partner[] {
    return logos.map((l: any) => ({
      name: l.nombre,
      logo: l.url,
      url:  l.enlace || '#',
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
