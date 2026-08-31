import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';

export interface AdmisionStep     { id: number; stepNumber: number; icon: string; title: string; description: string; }
export interface AdmisionReq      { id: number; icon: string; title: string; description: string; }
export interface AdmisionDownload { id: number; icon: string; label: string; url: string; }
export interface AdmisionDate     { id: number; title: string; subtitle: string; date: string; year: string; isPrimary: boolean; }

export interface AdmisionesConfig {
  heroBadge:        string;
  heroTitulo:       string;
  heroDescripcion:  string;
  heroImagenFondo:  string;
  heroBoton1Label:  string;
  heroBoton1Url:    string;
  heroBoton2Label:  string;
  heroBoton2Url:    string;
  procesoTitulo:       string;
  procesoDescripcion:  string;
  steps:               AdmisionStep[];
  requisitosTitulo:    string;
  requisitos:          AdmisionReq[];
  descargasTitulo:     string;
  descargas:           AdmisionDownload[];
  fechasTitulo:        string;
  fechas:              AdmisionDate[];
  urlCalendario:       string;
  ctaTitulo:       string;
  ctaDescripcion:  string;
  ctaBotonLabel:   string;
  ctaBotonUrl:     string;
}

// Solo copia genérica/segura — nada de fechas ni datos específicos inventados.
// Las listas se muestran vacías hasta que se carguen datos reales desde el panel admin.
const DEFAULT: AdmisionesConfig = {
  heroBadge:       '',
  heroTitulo:      'Admisiones',
  heroDescripcion: 'Conoce nuestro proceso de admisión y da el siguiente paso hacia tu futuro académico.',
  heroImagenFondo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZiSYHlwL2eMFS8LwboMn9x35bwQZhFD0ncUqfVvMQCMBVeCnGMl4WzzSV3CQGfsyhsx0K0EtYeGfVzQAIssV_5MMPoLLR4rnvzCm9EGwXul2Ik8NqM509nGmZlp4h3LZz3sB6QunWB-ZBxrai3UGpNJ-8C_K5rpvtGsN0u0HvXevuOqN47j2Sqvhgogsn3bUCLJyFs66wIEUdXhkZ9haUxPmZo0TUMYCEBOFjykmNGPdkJTpwdBMQABnhHdznvZGvcrj8mA639K4',
  heroBoton1Label: 'Inicia tu Solicitud',
  heroBoton1Url:   '',
  heroBoton2Label: 'Descargar Guía',
  heroBoton2Url:   '',
  procesoTitulo:      'Proceso de Admisión',
  procesoDescripcion: 'Sigue estos pasos para convertirte en parte de nuestra comunidad académica.',
  steps: [],
  requisitosTitulo: 'Requisitos',
  requisitos: [],
  descargasTitulo: 'Descargas Esenciales',
  descargas: [],
  fechasTitulo: 'Fechas Importantes',
  fechas: [],
  urlCalendario: '',
  ctaTitulo:      '¿Listo para dar forma a tu futuro?',
  ctaDescripcion: 'No pierdas la oportunidad de unirte a nuestra comunidad.',
  ctaBotonLabel:  'Inicia tu Solicitud',
  ctaBotonUrl:    '',
};

@Component({
  selector: 'app-admissions-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './admissions-page.component.html',
  styleUrls: ['./admissions-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdmissionsPageComponent implements OnInit {
  config: AdmisionesConfig = DEFAULT;

  constructor(private configPublica: ConfiguracionPublicaService) {}

  ngOnInit(): void {
    this.configPublica.get<AdmisionesConfig>('admisiones', DEFAULT).subscribe(cfg => {
      this.config = { ...DEFAULT, ...cfg };
    });
  }
}
