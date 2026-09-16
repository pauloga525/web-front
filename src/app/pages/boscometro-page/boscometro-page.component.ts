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

@Component({
  selector: 'app-boscometro-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BreadcrumbComponent, BarChartComponent],
  templateUrl: './boscometro-page.component.html',
  styleUrl: './boscometro-page.component.css',
})
export class BoscometroPageComponent implements OnInit {
  heroImagen = '';
  tablas: RecursoApi[] = [];
  graficos: RecursoApi[] = [];

  constructor(
    private readonly configPublica: ConfiguracionPublicaService,
    private readonly recursosApi: RecursosApiService,
  ) {}

  ngOnInit(): void {
    this.configPublica.get<{ heroImagen?: string }>('boscometro_page', {}).subscribe(cfg => {
      this.heroImagen = cfg?.heroImagen || '';
    });

    this.recursosApi.getByTipo(TIPO_TABLA, TIPO_GRAFICO).subscribe(list => {
      this.tablas = list.filter(r => r.tipo === TIPO_TABLA);
      this.graficos = list.filter(r => r.tipo === TIPO_GRAFICO);
    });
  }
}
