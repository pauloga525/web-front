import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { AutoridadesApiService, AutoridadApi } from '../../services/autoridades-api.service';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { WebsocketService } from '../../services/websocket.service';

interface MisionVisionItem { id: number; icon: string; title: string; description: string; }
interface ValorItem        { id: number; icon: string; title: string; description: string; }
interface TimelineEvent    { id: number; year: string; title: string; description: string; image: string; }

interface NosotrosConfig {
  heroTitulo:              string;
  heroDescripcion:         string;
  misionVision:            MisionVisionItem[];
  valoresTitulo:           string;
  valoresSubtitulo:        string;
  valores:                 ValorItem[];
  historiaTitulo:          string;
  historiaDescripcion:     string;
  historiaUrlRepositorio:  string;
  timeline:                TimelineEvent[];
  autoridadesTitulo:       string;
  autoridadesSubtitulo:    string;
  ctaTitulo:               string;
  ctaDescripcion:          string;
  ctaBoton1Label:          string;
  ctaBoton2Label:          string;
}

const DEFAULT_CONFIG: NosotrosConfig = {
  heroTitulo:      'Nuestra Institución',
  heroDescripcion: 'Formando líderes éticos y profesionales de excelencia para transformar el futuro del Ecuador y el mundo desde hace más de tres décadas.',
  misionVision: [
    {
      id: 1, icon: 'flag', title: 'Misión',
      description: 'Somos una Institución Salesiana que educa evangelizando y evangeliza educando a niños, adolescentes y jóvenes, con excelencia humana, científica, tecnológica y cultural, mediante un proyecto de formación integral orientado a Cristo, y de acuerdo a la pedagogía de Don Bosco, formamos buenos cristianos y honrados ciudadanos, actores sociales responsables con visión crítica de la realidad, para que contribuyan en la construcción de una sociedad más humana.',
    },
    {
      id: 2, icon: 'visibility', title: 'Visión',
      description: 'La Unidad Educativa Técnico Salesiano al 2027 será protagonista en procesos de innovación: educativo-pastoral, científica, tecnológica, deportiva y cultural, que fomenta la investigación y la creatividad formando a estudiantes de diversos sectores sociales desde el carisma salesiano, para que sean actores de su propia formación y aporten propositivamente a la transformación social.',
    },
  ],
  valoresTitulo:    'Valores Institucionales',
  valoresSubtitulo: 'Nuestra Esencia',
  valores: [
    { id: 1, icon: 'verified_user', title: 'Integridad',      description: 'Actuamos con honestidad, coherencia y transparencia en todas nuestras actividades académicas y administrativas.' },
    { id: 2, icon: 'lightbulb',     title: 'Innovación',      description: 'Fomentamos la creatividad y la búsqueda constante de nuevas soluciones a los desafíos contemporáneos.' },
    { id: 3, icon: 'award_star',    title: 'Excelencia',      description: 'Nos comprometemos con los más altos estándares de calidad en la enseñanza, la investigación y la gestión.' },
    { id: 4, icon: 'diversity_3',   title: 'Responsabilidad', description: 'Contribuimos activamente al bienestar de la comunidad y al cuidado del medio ambiente.' },
  ],
  historiaTitulo:          'Nuestra Historia',
  historiaDescripcion:     'Un legado de crecimiento y compromiso con la educación superior en Ecuador.',
  historiaUrlRepositorio:  '',
  timeline: [
    {
      id: 1, year: '1815', title: 'San Juan Bosco - El Fundador',
      description: 'Don Bosco nace en un hogar campesino del Piamonte, Italia. Gracias a la intuición de su madre, Margarita, y su apoyo incondicional, se aventura al sacerdocio. A pesar de las limitaciones financieras y la crisis social que vive Italia, continúa con espíritu firme hasta ordenarse de clérigo el 5 de junio de 1841. En Turín, decide entregar su vida completamente a los jóvenes más pobres, abandonados y en peligro de vulnerabilidad. Su pedagogía del amor da origen al "Sistema Preventivo": un sistema que implica totalidad, organicidad y orden en los valores, elementos y procedimientos pedagógicos que descansan en la razón, la religión y el amor.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq1t0475O9xnLKAS02uRrjYWjZiSmGEHlCkbCDNypZyUCUdWRvLTw-eWjMMIIEln6GeDN8aWJo1qRnANmsZL2SZevO4BCnvUk593kGRcdJkLTvWWydkgd1d7XsyBRXgkCcfnUfHe3Arlr5m2FV8xoQipwksFk7trh6VFd9_DNBIjAAMbH17A0IGDVKu0pUQqMnfoXg2fxJUueDoAzGfwJenbXo2ROh3M4G9uKr2Jfvmk7MgL6MeCFPggwO57eBg5CEc3JaHN2X1RI',
    },
    {
      id: 2, year: '1888', title: 'Los Salesianos Llegan a Ecuador',
      description: 'El 6 de diciembre de 1887, Don Luis Calcagno y siete salesianos reciben la última bendición de San Juan Bosco. Cuando llegan a Guayaquil el 12 de enero de 1888 y luego a Quito el 28 de enero, Don Bosco pide que le alcen su brazo derecho para dar su última bendición, que sería para Ecuador. El 31 de enero de ese año, fallece el "Padre y Maestro de la Juventud", dejando un legado que llegaría a transformar la educación en todo el territorio ecuatoriano.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgltAOLsIIn48WpJdXH65i8tNNAEmct77A7c47_zbS-gn41AmGaiukHaSHIkEZV4b9tyH3jSCccf6YavZBK_C276jvAZfLV-3AH6dJOaWTbWsmZJ35UFPx8IAIrnNtmD98CtY-73fs_Owe-89m18CjPEuar2E1fRHSF9P2bP_2_h5ctfhmAWQ_z2jakvXhSOyrt3h0MDYcCXivBIXlhqnS_-4bq7ydnslUvnX3vAwCsC9-dP3J3LP_-J7dKGJGIluNt7LnyrWjQTc',
    },
    {
      id: 3, year: '1893', title: 'Los Salesianos Llegan a Cuenca',
      description: 'El 14 de marzo de 1893, los Salesianos llegan a Cuenca, "puerta de las Misiones". Bajo la frase "Envióme Dios a evangelizar a los pobres", instalan el Oratorio de San José y empiezan a propagar la devoción a María Auxiliadora. Establecen talleres y admiten a los primeros estudiantes. En 1894, compran la casa e iglesia del Corazón de María. El 31 de octubre de 1933 se inicia la construcción del Instituto de Artes y Oficios "Cornelio Merchán", hoy Técnico Salesiano.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo7a6Sy0y3hBANA3umcBiw5f37y05ZK9YO_B5EF2P3hOsH50F_b6hJV5AJVwJB0LBtqIdumR7TUSpYgnaYgDzgQe4qTBQZtRwcKeh1RON9qwqnnvcRaOekMpV-FFKYEZ18AFE8qtcz101qH1nwI4KBJqJSnA0k77FPKAAybWykwPK6V8w04G8j1wB88ddLoNPcP23GVEAdcLz-sV41J9DRg-tzA4Fyp0WMmEoisqqQvUA1HsGH5i8KhhZSBEUPr-QRjcExnmHRpqE',
    },
    {
      id: 4, year: '1936', title: 'Nace el Colegio Técnico Salesiano',
      description: 'El Colegio "Técnico Salesiano", hoy Unidad Educativa, nace el 27 de febrero de 1936 (Resolución Ministerial N° 070). Al principio se denomina "Cornelio Merchán", hasta cuando por decreto supremo N° 444 del 18 de abril de 1973, se llama Instituto Fiscomisional Técnico Superior Salesiano. Durante más de 80 años han pasado ilustres salesianos que bajo una labor silenciosa han puesto su granito a esta obra.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzcLV7YSxlHh_AfPPKLL1iVxyjtGpym4DRRUeNY5OuPpxf3F2Y2CU5-oobcvphDOEflMSFx2nKj9wLgdlT2-BXU-8jB8jwDRxAVmhl3Nb2F4W_Ml1_nvq4EH3x5ojcUiUHMEKBoVbt24IU49uJ0cHfHzskKB_8zHvILQ_wDAUA4zmr3U5oww9R70hg2ZYhno_mVUbEN8KzTnNg-pplSEzOR7Ut4n2VOPkCfSDGwA8xh3Gy9KFW8Maud7A_epJDbPoA689bjWec6AU',
    },
    {
      id: 5, year: 'Presente', title: 'Continuidad del Legado Salesiano',
      description: 'El Técnico Salesiano sigue su peregrinaje a través del tiempo: desde el barrio de María Auxiliadora hasta 1967, luego en el barrio de El Vecino hasta 1994, y finalmente trasladándonos a la Parroquia Don Bosco. La UETS continúa su misión de formar profesionales técnicos bajo los principios salesianos de calidad, honestidad y compromiso social. Hoy, más de 85 años después, seguimos formando buenos cristianos y honrados ciudadanos.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzcLV7YSxlHh_AfPPKLL1iVxyjtGpym4DRRUeNY5OuPpxf3F2Y2CU5-oobcvphDOEflMSFx2nKj9wLgdlT2-BXU-8jB8jwDRxAVmhl3Nb2F4W_Ml1_nvq4EH3x5ojcUiUHMEKBoVbt24IU49uJ0cHfHzskKB_8zHvILQ_wDAUA4zmr3U5oww9R70hg2ZYhno_mVUbEN8KzTnNg-pplSEzOR7Ut4n2VOPkCfSDGwA8xh3Gy9KFW8Maud7A_epJDbPoA689bjWec6AU',
    },
  ],
  autoridadesTitulo:    'Autoridades Académicas',
  autoridadesSubtitulo: 'Liderazgo visionario que guía el rumbo de nuestra institución.',
  ctaTitulo:      'Sé parte del futuro hoy',
  ctaDescripcion: 'Descubre cómo nuestra propuesta académica puede potenciar tu talento y llevar tus ambiciones al siguiente nivel.',
  ctaBoton1Label: 'Únete a nuestra comunidad',
  ctaBoton2Label: 'Contactar Admisiones',
};

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AboutPageComponent implements OnInit, OnDestroy {
  breadcrumbs = [
    { label: 'Inicio', route: '/' },
    { label: 'Nosotros', route: '/about' }
  ];

  config: NosotrosConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  leaders: AutoridadApi[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private autoridadesApi: AutoridadesApiService,
    private configService: ConfiguracionPublicaService,
    private websocket: WebsocketService,
  ) {}

  ngOnInit(): void {
    this.autoridadesApi.autoridades$
      .pipe(takeUntil(this.destroy$))
      .subscribe(autoridades => { this.leaders = autoridades; });

    this.configService.get<NosotrosConfig>('nosotros', DEFAULT_CONFIG)
      .pipe(takeUntil(this.destroy$))
      .subscribe(cfg => this.applyConfig(cfg));

    this.websocket.on('configuracion:nosotros:actualizada')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => this.applyConfig(data?.datos ?? data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private applyConfig(cfg: any): void {
    if (!cfg) return;
    this.config = {
      heroTitulo:             cfg.heroTitulo             || DEFAULT_CONFIG.heroTitulo,
      heroDescripcion:        cfg.heroDescripcion        || DEFAULT_CONFIG.heroDescripcion,
      misionVision:           Array.isArray(cfg.misionVision)  && cfg.misionVision.length  ? cfg.misionVision  : DEFAULT_CONFIG.misionVision,
      valoresTitulo:          cfg.valoresTitulo          || DEFAULT_CONFIG.valoresTitulo,
      valoresSubtitulo:       cfg.valoresSubtitulo       || DEFAULT_CONFIG.valoresSubtitulo,
      valores:                Array.isArray(cfg.valores)       && cfg.valores.length       ? cfg.valores       : DEFAULT_CONFIG.valores,
      historiaTitulo:         cfg.historiaTitulo         || DEFAULT_CONFIG.historiaTitulo,
      historiaDescripcion:    cfg.historiaDescripcion    || DEFAULT_CONFIG.historiaDescripcion,
      historiaUrlRepositorio: cfg.historiaUrlRepositorio ?? DEFAULT_CONFIG.historiaUrlRepositorio,
      timeline:               Array.isArray(cfg.timeline)      && cfg.timeline.length      ? cfg.timeline      : DEFAULT_CONFIG.timeline,
      autoridadesTitulo:      cfg.autoridadesTitulo      || DEFAULT_CONFIG.autoridadesTitulo,
      autoridadesSubtitulo:   cfg.autoridadesSubtitulo   || DEFAULT_CONFIG.autoridadesSubtitulo,
      ctaTitulo:              cfg.ctaTitulo              || DEFAULT_CONFIG.ctaTitulo,
      ctaDescripcion:         cfg.ctaDescripcion         || DEFAULT_CONFIG.ctaDescripcion,
      ctaBoton1Label:         cfg.ctaBoton1Label         || DEFAULT_CONFIG.ctaBoton1Label,
      ctaBoton2Label:         cfg.ctaBoton2Label         || DEFAULT_CONFIG.ctaBoton2Label,
    };
  }

  getAuthorityBio(authority: AutoridadApi): string {
    const source = authority.fullBio || authority.specialization || authority.email || '';
    const summary = source.replace(/\s+/g, ' ').trim();
    return summary.length <= 150 ? summary : `${summary.slice(0, 147).trim()}...`;
  }

  getAuthorityImage(authority: AutoridadApi): string {
    return authority.image || '';
  }

  navigateToAuthority(authority: AutoridadApi): void {
    this.router.navigate(['/authority', authority._id]);
  }

  navigateToRepository(): void {
    const url = this.config.historiaUrlRepositorio;
    if (url) {
      window.open(url, '_blank');
    } else {
      this.router.navigate(['/servicios/repositorio']);
    }
  }
}
