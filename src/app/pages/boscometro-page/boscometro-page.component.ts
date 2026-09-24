import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';
import { RecursosApiService, RecursoApi } from '../../services/recursos-api.service';

const TIPO_TABLA = 'boscometro_tabla';
const TIPO_GRAFICO = 'boscometro_grafico';

/** Una sección agrupa la tabla y el gráfico que se importaron juntos (mismo seccionId). */
export interface SeccionBoscometro {
  key: string;
  orden: number;
  tabla?: RecursoApi;
  grafico?: RecursoApi;
}

@Component({
  selector: 'app-boscometro-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BreadcrumbComponent, BarChartComponent],
  templateUrl: './boscometro-page.component.html',
  styleUrl: './boscometro-page.component.css',
})
export class BoscometroPageComponent implements OnInit {
  heroImagen = '';
  secciones: SeccionBoscometro[] = [];

  constructor(
    private readonly configPublica: ConfiguracionPublicaService,
    private readonly recursosApi: RecursosApiService,
  ) {}

  ngOnInit(): void {
    this.configPublica.get<{ heroImagen?: string }>('boscometro_page', {}).subscribe(cfg => {
      this.heroImagen = cfg?.heroImagen || '';
    });

    this.recursosApi.getByTipo(TIPO_TABLA, TIPO_GRAFICO).subscribe(list => {
      this.secciones = this.construirSecciones(list);
    });
  }

  /** Agrupa tablas y gráficos por `seccionId` para mostrarlos juntos. Los recursos
   * legacy sin seccionId (o con solo tabla o solo gráfico) se siguen mostrando igual,
   * cada uno como su propia sección incompleta. */
  private construirSecciones(list: RecursoApi[]): SeccionBoscometro[] {
    const map = new Map<string, SeccionBoscometro>();
    for (const r of list) {
      const key = r.seccionId || r._id;
      const s = map.get(key) || { key, orden: r.orden };
      if (r.tipo === TIPO_TABLA) s.tabla = r; else if (r.tipo === TIPO_GRAFICO) s.grafico = r;
      s.orden = Math.min(s.orden, r.orden);
      map.set(key, s);
    }
    return [...map.values()].sort((a, b) => a.orden - b.orden);
  }
}
