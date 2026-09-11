import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { RecursosApiService, EnlaceRecurso } from '../../services/recursos-api.service';
import { VideoModalComponent } from '../../components/video-modal/video-modal.component';

type TipoInstructivo = 'pdf' | 'word' | 'excel' | 'video';

interface InstructivoCard {
  id: string;
  title: string;
  description: string;
  type: TipoInstructivo;
  category: string;
  url: string;
  enlaces: EnlaceRecurso[];
}

const TIPOS_VALIDOS: TipoInstructivo[] = ['pdf', 'word', 'excel', 'video'];

interface InstructivoCategoria { id: number; icon: string; name: string; }
interface Plataforma { id: number; name: string; image: string; url: string; }

interface InstructivosPageConfig {
  heroTitulo:      string;
  heroDescripcion: string;
  soporteUrl:      string;
  categorias:      InstructivoCategoria[];
}

const DEFAULT_CONFIG: InstructivosPageConfig = {
  heroTitulo:      'Instructivos y Tutoriales',
  heroDescripcion: 'Encuentra guías paso a paso, manuales en PDF y videotutoriales para dominar todas nuestras plataformas institucionales.',
  soporteUrl:      '/contacto',
  categorias:      [],
};

@Component({
  selector: 'app-instructivos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, VideoModalComponent],
  templateUrl: './instructivos-page.component.html',
  styleUrls: ['./instructivos-page.component.css']
})
export class InstructivosPageComponent implements OnInit {
  config: InstructivosPageConfig = DEFAULT_CONFIG;
  searchTerm: string = '';
  selectedCategory: string = '';
  sortBy: string = 'Recientes';

  instructivos: InstructivoCard[] = [];

  // Modal de reproducción de video — se abre al hacer click en "Ver Tutorial".
  videoModalOpen = false;
  videoModalEnlaces: EnlaceRecurso[] = [];
  // Plataformas digitales — mismo título y lista que Campus, Repositorio,
  // Inicio y Biblioteca (config 'campus').
  plataformas: Plataforma[] = [];
  plataformasTitulo = 'Plataformas Digitales';
  plataformasDescripcion = '';

  constructor(
    private configPublica: ConfiguracionPublicaService,
    private recursosApi: RecursosApiService,
  ) {}

  ngOnInit(): void {
    this.configPublica.get<InstructivosPageConfig>('instructivos_page', DEFAULT_CONFIG).subscribe(cfg => {
      this.config = { ...DEFAULT_CONFIG, ...cfg };
      if (!this.selectedCategory) this.selectedCategory = this.config.categorias[0]?.name ?? '';
    });
    this.recursosApi.getByTipo(...TIPOS_VALIDOS).subscribe(list => {
      this.instructivos = list.map(r => ({
        id: r._id,
        title: r.titulo,
        description: r.descripcion,
        type: (TIPOS_VALIDOS.includes(r.tipo as TipoInstructivo) ? r.tipo : 'pdf') as TipoInstructivo,
        category: r.categoria,
        url: r.url,
        // Compatibilidad con instructivos antiguos guardados solo con `url` (sin `enlaces`).
        enlaces: r.enlaces?.length ? r.enlaces : (r.url ? [{ url: r.url, descripcion: '' }] : []),
      }));
    });
    this.configPublica.get<Plataforma[]>('plataformas', []).subscribe(list => {
      this.plataformas = Array.isArray(list) ? list.filter(p => p.image) : [];
    });
    this.configPublica.get<{ plataformasTitulo?: string; plataformasDescripcion?: string }>('campus', {}).subscribe(cfg => {
      if (cfg?.plataformasTitulo) this.plataformasTitulo = cfg.plataformasTitulo;
      if (cfg?.plataformasDescripcion) this.plataformasDescripcion = cfg.plataformasDescripcion;
    });
  }

  get categoriesWithCount(): { name: string; icon: string; count: number }[] {
    return this.config.categorias.map(c => ({
      name: c.name,
      icon: c.icon,
      count: this.instructivos.filter(i => i.category === c.name).length,
    }));
  }

  get filteredInstructivos(): InstructivoCard[] {
    let list = this.instructivos.filter(i => i.category === this.selectedCategory);
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(i => i.title.toLowerCase().includes(term) || i.description.toLowerCase().includes(term));
    }
    return list;
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
  }

  onSearch(): void {}

  getTagColor(type: string): string {
    switch (type) {
      case 'word':  return 'bg-blue-100 text-blue-700';
      case 'excel': return 'bg-green-100 text-green-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      default:      return 'bg-red-100 text-red-700'; // pdf
    }
  }

  getTagText(type: string): string {
    switch (type) {
      case 'word':  return 'Word';
      case 'excel': return 'Excel';
      case 'video': return 'Video';
      default:      return 'PDF';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'word':  return 'text-blue-600';
      case 'excel': return 'text-green-600';
      case 'video': return 'text-secondary';
      default:      return 'text-red-500'; // pdf
    }
  }

  /** Icono de Material Symbols/Icons según el tipo de archivo. */
  getTypeIcon(type: string): string {
    switch (type) {
      case 'word':  return 'description';
      case 'excel': return 'table_chart';
      case 'video': return 'play_circle_filled';
      default:      return 'picture_as_pdf'; // pdf
    }
  }

  /** Versión "outline" del icono grande decorativo de fondo de cada tarjeta. */
  getBigTypeIcon(type: string): string {
    return type === 'video' ? 'play_circle' : this.getTypeIcon(type);
  }

  getBigIconTint(type: string): string {
    switch (type) {
      case 'word':  return 'text-blue-200';
      case 'excel': return 'text-green-200';
      case 'video': return 'text-blue-200';
      default:      return 'text-yellow-200'; // pdf
    }
  }

  getButtonColor(type: string): string {
    return type === 'video'
      ? 'bg-secondary text-white hover:bg-secondary/80'
      : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-secondary hover:border-secondary';
  }

  getButtonText(type: string): string {
    return type === 'video' ? 'Ver Tutorial' : 'Descargar';
  }

  abrirTutorial(instructivo: InstructivoCard): void {
    if (!instructivo.enlaces.length) return;
    this.videoModalEnlaces = instructivo.enlaces;
    this.videoModalOpen = true;
  }

  cerrarVideoModal(): void {
    this.videoModalOpen = false;
  }
}
