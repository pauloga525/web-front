import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { EspecialidadesApiService, Especialidad } from '../../services/especialidades-api.service';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';

interface BachilleratoConfig {
  heroImagenFondo: string;
  heroTitulo:      string;
  heroDescripcion: string;
  ctaTitulo:       string;
  ctaDescripcion:  string;
  ctaUrlDescarga:  string;
}

const DEFAULT_CONFIG: BachilleratoConfig = {
  heroImagenFondo: '',
  heroTitulo:      'Bachillerato',
  heroDescripcion: 'Descubre nuestro amplio rango de especialidades bachiller diseñadas para desarrollar profesionales exitosos.',
  ctaTitulo:       '¿Listo para construir tu futuro?',
  ctaDescripcion:  'Únete a nuestra comunidad educativa y comienza tu camino hacia la excelencia profesional y humana.',
  ctaUrlDescarga:  '/contact',
};

interface ProgramItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  faculty: string;
  image: string;
  slug: string;
}

@Component({
  selector: 'app-bachelor-programs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    BreadcrumbComponent,
    FooterComponent,
  ],
  templateUrl: './bachelor-programs.component.html',
  styleUrl: './bachelor-programs.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class BachelorProgramsComponent implements OnInit {
  pageConfig: BachilleratoConfig = { ...DEFAULT_CONFIG };

  get heroImagenFondo() { return this.pageConfig.heroImagenFondo; }
  get heroTitulo()      { return this.pageConfig.heroTitulo; }
  get heroDescripcion() { return this.pageConfig.heroDescripcion; }
  get ctaTitulo()       { return this.pageConfig.ctaTitulo; }
  get ctaDescripcion()  { return this.pageConfig.ctaDescripcion; }
  get ctaUrlDescarga()  { return this.pageConfig.ctaUrlDescarga || '/contact'; }

  programs: ProgramItem[] = [];
  filteredPrograms: ProgramItem[] = [];

  currentFilters = { faculty: '', modality: '', duration: '' };

  constructor(
    private readonly router: Router,
    private readonly especialidadesApi: EspecialidadesApiService,
    private readonly configService: ConfiguracionPublicaService,
  ) {}

  ngOnInit(): void {
    this.configService.get<BachilleratoConfig>('edu_bachillerato', DEFAULT_CONFIG).subscribe(data => {
      if (data && Object.keys(data).length) {
        this.pageConfig = { ...DEFAULT_CONFIG, ...data };
      }
    });

    this.especialidadesApi.getAllEspecialidades().subscribe({
      next: (especialidades: Especialidad[]) => {
        this.programs = especialidades.map(e => ({
          id:          e._id || e.id || '',
          title:       e.titulo || e.nombre || '',
          description: e.descripcion || '',
          duration:    e.duracion || '3 Años',
          faculty:     e.nivel || 'Technical',
          image:       e.imagenHero || e.imagen || '',
          slug:        this.toSlug(e.titulo || e.nombre || ''),
        }));
        this.filteredPrograms = [...this.programs];
      },
      error: () => { this.filteredPrograms = []; }
    });
  }

  private toSlug(text: string): string {
    return text.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-');
  }

  onFilterChange(): void {
    this.filteredPrograms = this.programs.filter(program => {
      if (this.currentFilters.faculty && program.faculty !== this.currentFilters.faculty) return false;
      if (this.currentFilters.duration && !program.duration.startsWith(this.currentFilters.duration)) return false;
      return true;
    });
  }

  navigateToCareer(program: ProgramItem): void {
    this.router.navigate(['/programa/especialidad', program.slug]);
  }
}
