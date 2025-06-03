import { Component } from '@angular/core';
import { ChartType } from 'angular-google-charts';


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  today = new Date();
  // Gráfico de pastel 3D
  pieChart3D = {
    title: 'Comodatos Por Mes',
    description: 'descripcion',
    type: ChartType.PieChart,
    data: [
      ['Enero', 8],
      ['Febrero', 8],
      ['Marzo', 4],
      ['Abril', 2],
      ['Mayo', 5],
    ],
    options: { is3D: true, legend: { position: 'bottom' } },
  };
  // Gráfico de pastel 2D
  pieChart2D = {
    title: 'Comodatos Por Mes',
    description: 'descripcion',
    type: ChartType.PieChart,
    data: [
      ['Enero', 8],
      ['Febrero', 8],
      ['Marzo', 4],
      ['Abril', 2],
      ['Mayo', 5],
    ],
    columns: ['Mes', 'Cantidad'],
    options: { legend: { position: 'bottom' }, responsive: true },
  };

  // Gráfico de barras
  barChart = {
    title: 'Ventas por producto',
    description: 'descripcion',
    type: ChartType.BarChart,
    data: [
      ['Laptop', 120],
      ['Tablet', 80],
      ['Teléfono', 150],
    ],
    columns: ['Producto', 'Ventas'],
    options: { colors: ['#4285F4'], legend: { position: 'bottom' } },
  };

  // Gráfico de líneas
  lineChart = {
    title: 'Crecimiento de usuarios',
    type: ChartType.LineChart,
    description: 'descripcion',
    data: [
      ['Enero', 100],
      ['Febrero', 120],
      ['Marzo', 150],
      ['Abril', 170],
    ],
    columns: ['Mes', 'Usuarios'],
    options: { curveType: 'function', legend: { position: 'bottom' } },
  };

  stackedColumnChart = {
    title: 'Usuarios por región (apilado)',
    type: ChartType.ColumnChart,
    description: 'descripcion',
    data: [
      ['2021', 100, 80, 50],
      ['2022', 120, 90, 60],
      ['2023', 150, 100, 70],
    ],
    columns: ['Año', 'Norte', 'Sur', 'Este'],
    options: {
      isStacked: false,
      colors: ['#3366cc', '#dc3912', '#ff9900'],
      legend: { position: 'bottom' },
    },
  };

  

}
