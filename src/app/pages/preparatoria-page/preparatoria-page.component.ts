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
  nivelId: 'preparatoria',
  heroImagenFondo: '',
  heroBadge: 'Académico',
  levelName: 'Preparatoria',
  levelDescription: 'Aprendizaje a través del juego y el descubrimiento en un ambiente cálido y seguro.',
  sectionTitle: 'Formación Lúdica y Segura',
  sectionDescription: 'En esta etapa crucial del desarrollo, creemos que el juego es el medio principal de aprendizaje.',
  sectionExtra: 'Proporcionamos un ambiente cálido y acogedor donde cada niño se siente valorado.',
  keyFacts: [
    { id: 1, icon: 'group',      title: 'Edades',   value: '4 - 5 años'           },
    { id: 2, icon: 'schedule',   title: 'Jornada',  value: 'Matutina y Vespertina' },
    { id: 3, icon: 'psychology', title: 'Enfoque',  value: 'Lúdico & Formativo'   },
  ],
  curriculumHighlights: [
    { id: 1, icon: 'games',    title: 'Aprendizaje Lúdico',   description: 'El juego como principal medio de aprendizaje y desarrollo.' },
    { id: 2, icon: 'favorite', title: 'Desarrollo Emocional', description: 'Acompañamiento en la construcción de emociones y relaciones.' },
  ],
  subjects: [
    { id: 1, name: 'Lenguaje y Comunicación'     },
    { id: 2, name: 'Pensamiento Lógico-Matemático' },
    { id: 3, name: 'Exploración del Entorno'     },
    { id: 4, name: 'Expresión Artística'         },
    { id: 5, name: 'Educación Física'            },
    { id: 6, name: 'Habilidades Sociales'        },
  ],
  environmentTitle: 'Espacios Diseñados para Explorar',
  environmentDescription: 'Nuestras aulas de Preparatoria están especialmente diseñadas con rincones de aprendizaje interactivos, áreas de juego estructurado y espacios verdes.',
  environmentImagen: '',
  ctaDescripcion: 'Agenda una visita al campus o solicita más información sobre nuestro proceso de admisión.',
};

@Component({
  selector: 'app-preparatoria-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, FooterComponent, AcademicPillarsComponent],
  templateUrl: './preparatoria-page.component.html',
  styleUrl: './preparatoria-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class PreparatoriaPageComponent implements OnInit {

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
    this.configService.get<NivelConfig>('nivel_preparatoria', DEFAULT).subscribe(data => {
      if (data && Object.keys(data).length) {
        this.config = { ...DEFAULT, ...data };
      }
    });
  }

  requestInfo() {
    window.location.href = '/admisiones';
  }
}
