import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AcademicPillarsComponent } from '../../components/academic-pillars/academic-pillars.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';

interface NivelConfig {
  nivelId: string;
  heroImagenFondo: string;
  heroBadge: string;
  levelName: string;
  levelDescription: string;
  sectionTitle: string;
  sectionDescription: string;
  sectionExtra: string;
  keyFacts:             { id: number; icon: string; title: string; value: string }[];
  curriculumHighlights: { id: number; icon: string; title: string; description: string }[];
  subjects:             { id: number; name: string }[];
  environmentTitle: string;
  environmentDescription: string;
  environmentImagen: string;
  ctaDescripcion: string;
}

const DEFAULT: NivelConfig = {
  nivelId: 'basica-media',
  heroImagenFondo: '',
  heroBadge: 'Académico',
  levelName: 'Básica Media',
  levelDescription: 'Consolidación de habilidades y desarrollo del pensamiento crítico.',
  sectionTitle: 'Preparación para la Excelencia Académica',
  sectionDescription: 'La etapa de Básica Media es crucial para consolidar las habilidades académicas y desarrollar el pensamiento crítico.',
  sectionExtra: 'Combinamos metodologías innovadoras con atención personalizada, asegurando que cada estudiante sienta el apoyo necesario para superar desafíos.',
  keyFacts: [
    { id: 1, icon: 'group',      title: 'Edades',  value: '9 - 12 años (4to a 6to)'      },
    { id: 2, icon: 'schedule',   title: 'Jornada', value: 'Matutina (7:15 AM - 1:30 PM)' },
    { id: 3, icon: 'psychology', title: 'Enfoque', value: 'Constructivista'               },
  ],
  curriculumHighlights: [
    { id: 1, icon: 'menu_book', title: 'Pensamiento Crítico',    description: 'Desarrollo de habilidades de análisis y razonamiento en profundidad.' },
    { id: 2, icon: 'calculate', title: 'Competencias Analíticas', description: 'Aplicación del razonamiento matemático y científico en contextos reales.' },
  ],
  subjects: [
    { id: 1, name: 'Lengua y Literatura'            },
    { id: 2, name: 'Matemáticas'                    },
    { id: 3, name: 'Ciencias Naturales'             },
    { id: 4, name: 'Estudios Sociales'              },
    { id: 5, name: 'Educación Física'               },
    { id: 6, name: 'Educación Cultural y Artística' },
    { id: 7, name: 'Computación'                    },
    { id: 8, name: 'Desarrollo Humano'              },
  ],
  environmentTitle: 'Aulas de Aprendizaje Activo',
  environmentDescription: 'Nuestras aulas de Básica Media están equipadas con recursos didácticos modernos, laboratorios, bibliotecas de aula y espacios para trabajo colaborativo.',
  environmentImagen: '',
  ctaDescripcion: 'Agenda una visita al campus o solicita más información sobre nuestro proceso de admisión.',
};

@Component({
  selector: 'app-basica-media-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, FooterComponent, AcademicPillarsComponent],
  templateUrl: './basica-media-page.component.html',
  styleUrl: './basica-media-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class BasicaMediaPageComponent implements OnInit {

  config: NivelConfig = { ...DEFAULT };

  get levelName()             { return this.config.levelName; }
  get levelDescription()      { return this.config.levelDescription; }
  get sectionTitle()          { return this.config.sectionTitle; }
  get sectionDescription()    { return this.config.sectionDescription; }
  get sectionExtra()          { return this.config.sectionExtra; }
  get environmentTitle()      { return this.config.environmentTitle; }
  get environmentDescription(){ return this.config.environmentDescription; }
  get environmentImagen()     { return this.config.environmentImagen; }
  get ctaDescripcion()        { return this.config.ctaDescripcion; }
  get keyFacts()              { return this.config.keyFacts; }
  get curriculumHighlights()  { return this.config.curriculumHighlights; }
  get subjects()              { return this.config.subjects; }
  get heroImagenFondo()       { return this.config.heroImagenFondo; }

  constructor(private readonly configService: ConfiguracionPublicaService) {}

  ngOnInit(): void {
    this.configService.get<NivelConfig>('nivel_basica-media', DEFAULT).subscribe(data => {
      if (data && Object.keys(data).length) {
        this.config = { ...DEFAULT, ...data };
      }
    });
  }

  requestInfo() {
    window.location.href = '/admisiones';
  }
}
