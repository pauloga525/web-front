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
  nivelId: 'basica-superior',
  heroImagenFondo: '',
  heroBadge: 'Académico',
  levelName: 'Básica Superior',
  levelDescription: 'Potenciamos las habilidades de nuestros estudiantes de 8vo, 9no y 10mo año a través de un aprendizaje activo y colaborativo.',
  sectionTitle: 'Formación Integral para la Adolescencia',
  sectionDescription: 'La etapa de Básica Superior es fundamental en el desarrollo cognitivo y emocional de los adolescentes.',
  sectionExtra: 'Combinamos rigor académico con un fuerte apoyo socioemocional, asegurando que cada alumno descubra sus talentos y se prepare para el Bachillerato.',
  keyFacts: [
    { id: 1, icon: 'group',      title: 'Edades',  value: '12 - 14 años (8vo, 9no, 10mo)' },
    { id: 2, icon: 'schedule',   title: 'Jornada', value: 'Matutina (7:15 AM - 1:30 PM)'  },
    { id: 3, icon: 'psychology', title: 'Enfoque', value: 'Constructivista & Humanista'    },
  ],
  curriculumHighlights: [
    { id: 1, icon: 'translate', title: 'Inglés Intensivo', description: 'Certificación Cambridge y clases diarias.' },
    { id: 2, icon: 'science',   title: 'Proyectos STEAM',  description: 'Ciencia, Tecnología, Ingeniería, Arte y Matemáticas.' },
  ],
  subjects: [
    { id: 1, name: 'Matemáticas'                     },
    { id: 2, name: 'Lengua y Literatura'             },
    { id: 3, name: 'Ciencias Naturales'              },
    { id: 4, name: 'Estudios Sociales'               },
    { id: 5, name: 'Educación Física'                },
    { id: 6, name: 'Educación Cultural y Artística'  },
    { id: 7, name: 'Computación y Robótica'          },
    { id: 8, name: 'Desarrollo Humano Integral'      },
  ],
  environmentTitle: 'Un Entorno para Descubrir',
  environmentDescription: 'Nuestros estudiantes de Básica Superior tienen acceso a laboratorios de ciencias totalmente equipados y una biblioteca moderna diseñada para la investigación.',
  environmentImagen: '',
  ctaDescripcion: 'Agenda una visita al campus o solicita más información sobre nuestro proceso de admisión.',
};

@Component({
  selector: 'app-basica-superior-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, FooterComponent, AcademicPillarsComponent],
  templateUrl: './basica-superior-page.component.html',
  styleUrl: './basica-superior-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class BasicaSuperiorPageComponent implements OnInit {

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
    this.configService.get<NivelConfig>('nivel_basica-superior', DEFAULT).subscribe(data => {
      if (data && Object.keys(data).length) {
        this.config = { ...DEFAULT, ...data };
      }
    });
  }

  requestInfo() {
    window.location.href = '/admisiones';
  }
}
