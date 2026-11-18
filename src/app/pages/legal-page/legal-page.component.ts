/**
 * @file legal-page.component.ts
 * @description Página de texto legal (Política de privacidad / Términos de uso).
 * El tipo llega por `data.tipo` de la ruta; el texto se lee de la configuración
 * pública 'paginas_legales' (editable en el panel: Footer → Páginas legales).
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { PAGINAS_LEGALES_DEFAULT, PaginaLegal, PaginasLegales } from './legal-defaults';

type TipoLegal = keyof PaginasLegales;

/** Trozo de texto: normal o correo electrónico (se muestra como enlace mailto). */
interface Segmento { texto: string; email?: boolean; }

type Bloque =
  | { tipo: 'h2'; id: string; texto: string }
  | { tipo: 'p'; segmentos: Segmento[] }
  | { tipo: 'ul'; items: Segmento[][] };

const RUTAS: Record<TipoLegal, string> = {
  privacidad: '/politica-privacidad',
  terminos: '/terminos-de-uso',
};

const EMAIL = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function segmentar(linea: string): Segmento[] {
  return linea.split(EMAIL).filter(Boolean).map(t => (/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(t) ? { texto: t, email: true } : { texto: t }));
}

function slug(texto: string, usados: Set<string>): string {
  const base = texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'seccion';
  let id = base, n = 2;
  while (usados.has(id)) id = `${base}-${n++}`;
  usados.add(id);
  return id;
}

/** Convierte el texto plano ("## " título, "- " lista, línea en blanco = párrafo) en bloques. */
function parsear(contenido: string): Bloque[] {
  const bloques: Bloque[] = [];
  const usados = new Set<string>();
  let parrafo: string[] = [];
  let lista: Segmento[][] | null = null;
  const cerrar = () => {
    if (parrafo.length) { bloques.push({ tipo: 'p', segmentos: segmentar(parrafo.join(' ')) }); parrafo = []; }
    if (lista) { bloques.push({ tipo: 'ul', items: lista }); lista = null; }
  };
  for (const cruda of (contenido ?? '').split(/\r?\n/)) {
    const linea = cruda.trim();
    if (!linea) { cerrar(); continue; }
    if (linea.startsWith('## ')) {
      cerrar();
      const texto = linea.slice(3).trim();
      bloques.push({ tipo: 'h2', id: slug(texto, usados), texto });
    } else if (/^[-•*] /.test(linea)) {
      if (parrafo.length) { bloques.push({ tipo: 'p', segmentos: segmentar(parrafo.join(' ')) }); parrafo = []; }
      (lista ??= []).push(segmentar(linea.slice(2).trim()));
    } else {
      if (lista) { bloques.push({ tipo: 'ul', items: lista }); lista = null; }
      parrafo.push(linea);
    }
  }
  cerrar();
  return bloques;
}

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './legal-page.component.html',
})
export class LegalPageComponent implements OnInit, OnDestroy {
  tipo: TipoLegal = 'privacidad';
  pagina: PaginaLegal = PAGINAS_LEGALES_DEFAULT.privacidad;
  bloques: Bloque[] = [];
  otra = { titulo: '', ruta: '' };

  private datos: PaginasLegales = PAGINAS_LEGALES_DEFAULT;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly configService: ConfiguracionPublicaService,
    private readonly title: Title,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.route.data,
      this.configService.get<Partial<PaginasLegales>>('paginas_legales', {}),
    ]).pipe(takeUntil(this.destroy$)).subscribe(([data, cfg]) => {
      this.tipo = data['tipo'] === 'terminos' ? 'terminos' : 'privacidad';
      this.datos = {
        privacidad: this.completar(cfg?.privacidad, PAGINAS_LEGALES_DEFAULT.privacidad),
        terminos: this.completar(cfg?.terminos, PAGINAS_LEGALES_DEFAULT.terminos),
      };
      this.render();
    });
  }

  /** Usa el texto del panel si existe; los campos vacíos caen al texto por defecto. */
  private completar(p: Partial<PaginaLegal> | undefined, def: PaginaLegal): PaginaLegal {
    return {
      titulo: p?.titulo?.trim() || def.titulo,
      actualizado: p?.actualizado || def.actualizado,
      contenido: p?.contenido?.trim() || def.contenido,
    };
  }

  private render(): void {
    this.pagina = this.datos[this.tipo];
    this.bloques = parsear(this.pagina.contenido);
    const otroTipo: TipoLegal = this.tipo === 'privacidad' ? 'terminos' : 'privacidad';
    this.otra = { titulo: this.datos[otroTipo].titulo, ruta: RUTAS[otroTipo] };
    this.title.setTitle(`${this.pagina.titulo} | Unidad Educativa Técnico Salesiano`);
  }

  get secciones(): { id: string; texto: string }[] {
    return this.bloques.filter((b): b is Extract<Bloque, { tipo: 'h2' }> => b.tipo === 'h2');
  }

  get fechaActualizado(): string {
    const [y, m, d] = (this.pagina.actualizado || '').split('-').map(Number);
    if (!y || !m || !d) return '';
    return new Date(y, m - 1, d).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  irA(id: string, ev: Event): void {
    ev.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
