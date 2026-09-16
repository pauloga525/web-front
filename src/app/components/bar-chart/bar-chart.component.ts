/**
 * @file bar-chart.component.ts
 * @description Gráfico de barras genérico (Chart.js) — usado por la página de
 * Boscómetro para mostrar los puntos {curso, total} importados desde Excel.
 * No hay ninguna librería de gráficos en el proyecto todavía, así que se
 * agregó Chart.js (sin wrapper de Angular) para mantenerlo simple: un
 * <canvas> + `new Chart(...)`, recreado cuando cambian los datos.
 */
import {
  Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, OnDestroy, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas></canvas>`,
  styles: [`:host { display: block; position: relative; height: 320px; width: 100%; }`],
})
export class BarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** [{curso, total}, ...] — se pasa el arreglo tal cual (referencia estable)
      en vez de derivar labels/data con una función en el template, porque
      una función ahí se re-ejecuta en cada detección de cambios devolviendo
      un arreglo nuevo, y eso destruía y recreaba el gráfico sin parar antes
      de que llegara a dibujarse. */
  @Input() datos: { curso: string; total: number }[] = [];
  @Input() color = '#0066cc';

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private vistaLista = false;

  ngAfterViewInit(): void {
    this.vistaLista = true;
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Guarda extra: si 'datos' no cambió de referencia, no vuelve a dibujar
    // (evita destruir/recrear el gráfico si algún binding se re-evalúa).
    if (changes['datos'] && changes['datos'].previousValue === changes['datos'].currentValue) return;
    if (this.vistaLista) this.render();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private render(): void {
    this.chart?.destroy();
    if (!this.canvasRef || !this.datos.length) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datos.map(d => d.curso),
        datasets: [{
          label: 'Total',
          data: this.datos.map(d => d.total),
          backgroundColor: this.color,
          borderRadius: 4,
          maxBarThickness: 40,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', align: 'end' },
          tooltip: { enabled: true },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'TOTAL' } },
          x: { title: { display: true, text: 'Curso' } },
        },
      },
    };

    this.chart = new Chart(this.canvasRef.nativeElement, config);
  }
}
