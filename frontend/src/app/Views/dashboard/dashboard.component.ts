import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService } from '../../Services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private dash = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  kpis = { total_productos: 0, total_stock: 0, valor_inventario: 0 };
  criticos: any[] = [];

  barChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Stock' }] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true };
  barChartType: 'bar' = 'bar';

  doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [] }] };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = { responsive: true };
  doughnutChartType: 'doughnut' = 'doughnut';

  ventasSemanalesData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Ventas' }] };
  ventasSemanalesOptions: ChartConfiguration<'bar'>['options'] = { responsive: true };
  ventasSemanalesType: 'bar' = 'bar';

  ventasMensualesData: ChartData<'line'> = { labels: [], datasets: [{ data: [], label: 'Ventas' }] };
  ventasMensualesOptions: ChartConfiguration<'line'>['options'] = { responsive: true };
  ventasMensualesType: 'line' = 'line';

  ngOnInit() {
    this.dash.obtener().subscribe({
      next: (data) => {
        this.kpis = data.kpis;
        this.criticos = data.criticos ?? [];
        const labels = (data.categorias ?? []).map((c: any) => c.categoria);
        this.barChartData = { labels, datasets: [{ data: (data.categorias ?? []).map((c: any) => c.stock_total), label: 'Stock' }] };
        this.doughnutChartData = { labels, datasets: [{ data: (data.categorias ?? []).map((c: any) => c.valor_total) }] };
        this.ventasSemanalesData = { labels: (data.ventas_semanales ?? []).map((v: any) => v.semana), datasets: [{ data: (data.ventas_semanales ?? []).map((v: any) => v.total), label: 'Ventas' }] };
        this.ventasMensualesData = { labels: (data.ventas_mensuales ?? []).map((v: any) => v.mes), datasets: [{ data: (data.ventas_mensuales ?? []).map((v: any) => v.total), label: 'Ventas' }] };
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }
}
