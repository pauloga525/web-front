import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { RecursosApiService } from '../../services/recursos-api.service';

interface InstructivoCard {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video';
  category: string;
  url: string;
}

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
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './instructivos-page.component.html',
  styleUrls: ['./instructivos-page.component.css']
})
export class InstructivosPageComponent implements OnInit {
  config: InstructivosPageConfig = DEFAULT_CONFIG;
  searchTerm: string = '';
  selectedCategory: string = '';
  sortBy: string = 'Recientes';

  instructivos: InstructivoCard[] = [];
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
    this.recursosApi.getByTipo('pdf', 'video').subscribe(list => {
      this.instructivos = list.map(r => ({
        id: r._id,
        title: r.titulo,
        description: r.descripcion,
        type: r.tipo === 'video' ? 'video' : 'pdf',
        category: r.categoria,
        url: r.url,
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
    return type === 'pdf' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';
  }

  getTagText(type: string): string {
    return type === 'pdf' ? 'PDF' : 'Video';
  }

  getIconColor(type: string): string {
    return type === 'pdf' ? 'text-red-500' : 'text-secondary';
  }

  getButtonColor(type: string): string {
    return type === 'pdf' ? 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-secondary hover:border-secondary'
      : 'bg-secondary text-white hover:bg-secondary/80';
  }

  getButtonText(type: string): string {
    return type === 'pdf' ? 'Descargar' : 'Ver Tutorial';
  }
}
