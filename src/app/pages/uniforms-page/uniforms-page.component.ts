import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ImageGalleryComponent, GalleryImageItem } from '../../components/image-gallery/image-gallery.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { UniformesApiService, UniformeApi } from '../../services/uniformes-api.service';

interface CaracteristicaUniforme {
  id: number;
  titulo: string;
  descripcion: string;
}

interface UniformesPageConfig {
  heroTitulo: string;
  heroDescripcion: string;
  heroImagen: string;
  card1Titulo: string;
  card1Desc: string;
  card2Titulo: string;
  card2Desc: string;
  card3Valor: string;
  card3Titulo: string;
  card3Desc: string;
  caracteristicas: CaracteristicaUniforme[];
}

const DEFAULT_CONFIG: UniformesPageConfig = {
  heroTitulo: 'Uniformes Escolares',
  heroDescripcion: 'Visualiza nuestros uniformes escolares con todas las características y detalles',
  heroImagen: '',
  card1Titulo: 'Tipos de Uniformes',
  card1Desc: 'Opciones para todos los niveles educativos',
  card2Titulo: 'Categorías',
  card2Desc: 'Diario, deportivo, ceremonia y más',
  card3Valor: '100%',
  card3Titulo: 'Calidad Garantizada',
  card3Desc: 'Tela de primera calidad y durabilidad',
  caracteristicas: [
    { id: 1, titulo: 'Tela de Calidad',        descripcion: 'Material transpirable y duradero para máximo confort' },
    { id: 2, titulo: 'Diseño Moderno',         descripcion: 'Estilos actuales que reflejan la identidad institucional' },
    { id: 3, titulo: 'Variedad de Tallas',     descripcion: 'Disponible en todas las tallas desde XS hasta XXL' },
    { id: 4, titulo: 'Bordado Institucional',  descripcion: 'Logo y distintivos bordados con precisión' },
    { id: 5, titulo: 'Fácil de Limpiar',       descripcion: 'Resistente al lavado frecuente sin decolorarse' },
    { id: 6, titulo: 'Garantía de Calidad',    descripcion: 'Respaldado por garantía de satisfacción institucional' },
  ],
};

@Component({
  selector: 'app-uniforms-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    BreadcrumbComponent,
    FooterComponent,
    ImageGalleryComponent
  ],
  templateUrl: './uniforms-page.component.html',
  styleUrl: './uniforms-page.component.css',
})
export class UniformsPageComponent implements OnInit {
  config: UniformesPageConfig = DEFAULT_CONFIG;
  uniforms: UniformeApi[] = [];
  selectedUniformId: string = '';

  breadcrumbItems: any[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Estudiantes', url: '/estudiantes' },
    { label: 'Uniformes Escolares', url: '/estudiantes/uniformes' }
  ];

  constructor(
    private configService: ConfiguracionPublicaService,
    private uniformesApi: UniformesApiService,
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);

    this.configService.get<Partial<UniformesPageConfig>>('uniformes_page', DEFAULT_CONFIG)
      .subscribe(config => this.config = {
        ...DEFAULT_CONFIG,
        ...config,
        caracteristicas: config?.caracteristicas ?? DEFAULT_CONFIG.caracteristicas,
      });

    this.uniformesApi.uniformes$.subscribe(list => {
      this.uniforms = list;
      if (!this.selectedUniformId && list.length) {
        this.selectedUniformId = list[0]._id;
      }
    });
  }

  get selectedUniform(): UniformeApi | undefined {
    return this.uniforms.find(u => u._id === this.selectedUniformId);
  }

  get selectedUniformImages(): GalleryImageItem[] {
    const u = this.selectedUniform;
    if (!u) return [];
    return u.images.map((img, i) => ({
      id: `${u._id}-${i}`,
      url: img.url,
      alt: img.alt,
      title: img.alt,
      description: '',
    }));
  }

  selectUniform(uniformId: string) {
    this.selectedUniformId = uniformId;
  }

  get categories(): string[] {
    return Array.from(new Set(this.uniforms.map(u => u.category).filter(Boolean)));
  }
}
