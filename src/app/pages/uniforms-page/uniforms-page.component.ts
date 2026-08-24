import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ImageGalleryComponent, GalleryImageItem } from '../../components/image-gallery/image-gallery.component';

interface UniformType {
  id: string;
  name: string;
  description: string;
  category: string;
  images: GalleryImageItem[];
  price?: string;
  availability?: string;
}

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
  encapsulation: ViewEncapsulation.Emulated
})
export class UniformsPageComponent implements OnInit {
  uniforms: UniformType[] = [
    {
      id: '1',
      name: 'Uniforme Diario - Femenino',
      description: 'Uniforme oficial para uso diario de estudiantes mujeres. Confeccionado en tela de calidad superior con tejido transpirable.',
      category: 'Femenino',
      images: [
        {
          id: '1-1',
          url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
          alt: 'Uniforme diario femenino frontal',
          title: 'Vista Frontal',
          description: 'Uniforme completo con blusa blanca y falda azul marino'
        },
        {
          id: '1-2',
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
          alt: 'Uniforme diario femenino lateral',
          title: 'Vista Lateral',
          description: 'Detalle lateral del uniforme mostrando el ajuste perfecto'
        },
        {
          id: '1-3',
          url: 'https://images.unsplash.com/photo-1595727612645-e51df1bdc82f?w=800&q=80',
          alt: 'Uniforme diario femenino detalle',
          title: 'Detalle de Tela',
          description: 'Acercamiento a la calidad de la tela y costuras'
        }
      ],
      price: '$85.00',
      availability: 'En stock'
    },
    {
      id: '2',
      name: 'Uniforme Diario - Masculino',
      description: 'Uniforme oficial para uso diario de estudiantes varones. Pantalón azul marino con camisa blanca de algodón.',
      category: 'Masculino',
      images: [
        {
          id: '2-1',
          url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
          alt: 'Uniforme diario masculino frontal',
          title: 'Vista Frontal',
          description: 'Uniforme completo con camisa blanca y pantalón azul marino'
        },
        {
          id: '2-2',
          url: 'https://images.unsplash.com/photo-1516824750671-b87dcf7cb94b?w=800&q=80',
          alt: 'Uniforme diario masculino lateral',
          title: 'Vista Lateral',
          description: 'Detalle lateral mostrando el corte y proporciones del uniforme'
        },
        {
          id: '2-3',
          url: 'https://images.unsplash.com/photo-1578752994566-24676b52af77?w=800&q=80',
          alt: 'Uniforme diario masculino detalle',
          title: 'Detalles',
          description: 'Acercamiento a los botones y bordados de la institución'
        }
      ],
      price: '$78.00',
      availability: 'En stock'
    },
    {
      id: '3',
      name: 'Uniforme de Educación Física',
      description: 'Conjunto cómodo y funcional para clases de educación física. Buzo y pantalón deportivo con logo institucional.',
      category: 'Deportivo',
      images: [
        {
          id: '3-1',
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
          alt: 'Uniforme deportivo frontal',
          title: 'Vista Frontal',
          description: 'Conjunto deportivo completo con buzo y pantalón'
        },
        {
          id: '3-2',
          url: 'https://images.unsplash.com/photo-1506368299235-c3fab2d2da0d?w=800&q=80',
          alt: 'Uniforme deportivo lateral',
          title: 'Vista Lateral',
          description: 'Detalle del corte ergonómico del uniforme deportivo'
        },
        {
          id: '3-3',
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
          alt: 'Logo institucional',
          title: 'Logo Institucional',
          description: 'Bordado del logo de la institución en el pecho'
        }
      ],
      price: '$95.00',
      availability: 'En stock'
    },
    {
      id: '4',
      name: 'Uniforme de Ceremonia',
      description: 'Uniforme formal para eventos especiales y ceremonias. Diseño elegante y profesional con detalles en la cintura.',
      category: 'Ceremonia',
      images: [
        {
          id: '4-1',
          url: 'https://images.unsplash.com/photo-1595777707802-41dc20dd8c2e?w=800&q=80',
          alt: 'Uniforme de ceremonia frontal',
          title: 'Vista Frontal',
          description: 'Uniforme de ceremonia con acabados elegantes'
        },
        {
          id: '4-2',
          url: 'https://images.unsplash.com/photo-1591200556793-32f74fbd90b5?w=800&q=80',
          alt: 'Uniforme de ceremonia lateral',
          title: 'Vista Lateral',
          description: 'Detalle lateral del uniforme formal'
        },
        {
          id: '4-3',
          url: 'https://images.unsplash.com/photo-1594932202191-54b87b22c13f?w=800&q=80',
          alt: 'Detalles de ceremonia',
          title: 'Detalles Especiales',
          description: 'Acercamiento a los bordados y detalles de ceremonia'
        }
      ],
      price: '$120.00',
      availability: 'Bajo pedido'
    }
  ];

  selectedUniformId: string = '1';
  breadcrumbItems: any[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Estudiantes', url: '/estudiantes' },
    { label: 'Uniformes Escolares', url: '/estudiantes/uniformes' }
  ];

  ngOnInit() {
    // Aquí puedes cargar los datos desde un servicio si es necesario
    window.scrollTo(0, 0);
  }

  get selectedUniform(): UniformType | undefined {
    return this.uniforms.find(u => u.id === this.selectedUniformId);
  }

  selectUniform(uniformId: string) {
    this.selectedUniformId = uniformId;
  }

  getUniformsByCategory(category: string): UniformType[] {
    return this.uniforms.filter(u => u.category === category);
  }

  get categories(): string[] {
    return Array.from(new Set(this.uniforms.map(u => u.category)));
  }
}
