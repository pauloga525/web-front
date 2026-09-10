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
  nivelId: 'basica-elemental',
  heroImagenFondo: '',
  heroBadge: 'Académico',
  levelName: 'Básica Elemental',
  levelDescription: 'Cimientos sólidos en lectura, escritura y lógica matemática.',
  sectionTitle: 'Cimientos para el Éxito Académico',
  sectionDescription: 'La etapa de Básica Elemental es fundamental para establecer cimientos sólidos en lectura, escritura y razonamiento matemático.',
  sectionExtra: 'Combinamos metodologías innovadoras con atención personalizada, asegurando que cada estudiante sienta el apoyo necesario para superar desafíos.',
  keyFacts: [
    { id: 1, icon: 'group',      title: 'Edades',  value: '6 - 8 años (1ero a 3ero)'     },
    { id: 2, icon: 'schedule',   title: 'Jornada', value: 'Matutina (7:15 AM - 1:30 PM)' },
    { id: 3, icon: 'psychology', title: 'Enfoque', value: 'Constructivista'               },
  ],
  curriculumHighlights: [
    { id: 1, icon: 'menu_book', title: 'Lectoescritura',   description: 'Desarrollo sólido de habilidades de lectura y escritura desde el inicio.' },
    { id: 2, icon: 'calculate', title: 'Pensamiento Lógico', description: 'Desarrollo de razonamiento matemático a través de actividades prácticas.' },
  ],
  subjects: [
    { id: 1, name: 'Lengua y Literatura'             },
    { id: 2, name: 'Matemáticas'                     },
    { id: 3, name: 'Ciencias Naturales'              },
    { id: 4, name: 'Estudios Sociales'               },
    { id: 5, name: 'Educación Física'                },
    { id: 6, name: 'Educación Cultural y Artística'  },
    { id: 7, name: 'Computación'                     },
    { id: 8, name: 'Desarrollo Humano'               },
  ],
  environmentTitle: 'Aulas de Aprendizaje Activo',
  environmentDescription: 'Nuestras aulas de Básica Elemental están equipadas con recursos didácticos modernos, bibliotecas de aula y espacios para trabajo colaborativo.',
  environmentImagen: '',
  ctaDescripcion: 'Agenda una visita al campus o solicita más información sobre nuestro proceso de admisión.',
};

@Component({
  selector: 'app-basica-elemental-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, FooterComponent, AcademicPillarsComponent],
  templateUrl: './basica-elemental-page.component.html',
  styleUrl: './basica-elemental-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class BasicaElementalPageComponent implements OnInit {

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
    this.configService.get<NivelConfig>('nivel_basica-elemental', DEFAULT).subscribe(data => {
      if (data && Object.keys(data).length) {
        this.config = { ...DEFAULT, ...data };
      }
    });
  }

  requestInfo() {
    window.location.href = '/admisiones';
  }
}
