import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SOCIAL_META, SocialMeta, SocialType, socialType } from './social-networks';

interface PartnerSocial {
  type: SocialType;
  url: string;
  meta: SocialMeta;
}

interface Partner {
  name: string;
  logo: string;
  url: string;
  socials: PartnerSocial[];
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
  selected: Partner | null = null;

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
      url:  l.enlace || '',
      socials: (Array.isArray(l.redes) ? l.redes : [])
        .filter((r: any) => r?.url)
        .map((r: any): PartnerSocial => {
          const type = socialType(r.tipo);
          return { type, url: r.url, meta: SOCIAL_META[type] };
        }),
    }));
  }

  /** Con redes abre el modal; sin redes cae al enlace simple (si existe). */
  open(partner: Partner): void {
    if (partner.socials.length) {
      this.selected = partner;
    } else if (partner.url) {
      window.open(partner.url, '_blank', 'noopener,noreferrer');
    }
  }

  @HostListener('document:keydown.escape')
  close(): void {
    this.selected = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
