import { Component } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Legend } from 'chart.js';

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
    options: { legend: { position: 'bottom'  } ,responsive: true},
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

  comboChart = {
    title: 'Ventas vs Meta',
    type: ChartType.ComboChart,
    description: 'descripcion',
    data: [
      ['Enero', 1000, 1200],
      ['Febrero', 1170, 1200],
      ['Marzo', 660, 1200],
      ['Abril', 1030, 1200],
    ],
    columns: ['Mes', 'Ventas', 'Meta'],
    options: {
      seriesType: 'bars',
      series: { 1: { type: 'line', color: 'red' } },
      legend: { position: 'bottom' },
    },
  };

  treeMapChart = {
    title: 'Presupuesto por categoría',
    type: ChartType.TreeMap,
    description: 'descripcion',
    data: [
      ['Global', null, 0],
      ['Marketing', 'Global', 400],
      ['R&D', 'Global', 300],
      ['Ventas', 'Global', 200],
      ['Publicidad', 'Marketing', 150],
      ['Eventos', 'Marketing', 250],
      ['Investigación', 'R&D', 180],
      ['Desarrollo', 'R&D', 120],
    ],
    columns: ['Name', 'Parent', 'Value'],
    options: {
      minColor: '#f9f9f9',
      midColor: '#87ceeb',
      maxColor: '#005073',
      showScale: true,
    },
  };

  comboChart2 = {
    title: 'Ventas vs Coste Mensual',
    type: ChartType.ComboChart,
    description:
      'Comparación entre ventas y coste por mes con combinación de barras y línea',
    data: [
      ['Ene', 1000, 400],
      ['Feb', 1170, 460],
      ['Mar', 660, 1120],
      ['Abr', 1030, 540],
    ],
    columns: ['Mes', 'Ventas', 'Coste'],
    options: {
      seriesType: 'bars',
      series: { 1: { type: 'line' } },
      legend: { position: 'bottom' },
    },
  };

  waterfallChart = {
    title: 'Flujo Financiero',
    type: ChartType.ColumnChart,
    description: 'Visualiza ingresos y egresos acumulativos hasta el total',
    data: [
      ['Inicio', 1000, true],
      ['Ingresos', 500, false],
      ['Gastos', -300, false],
      ['Impuestos', -100, false],
      ['Total', 1100, true],
    ],
    columns: ['Concepto', 'Importe', { role: 'total' }],
    options: {
      legend: { position: 'none' },
    },
  };

  ganttChart = {
    title: 'Cronograma del Proyecto',
    type: ChartType.Gantt,
    description: 'Seguimiento de tareas y dependencias del proyecto',
    data: [
      [
        'T1',
        'Diseño',
        new Date(2025, 4, 1),
        new Date(2025, 4, 5),
        0,
        100,
        null,
      ],
      [
        'T2',
        'Desarrollo',
        new Date(2025, 4, 6),
        new Date(2025, 4, 20),
        0,
        60,
        'T1',
      ],
      [
        'T3',
        'Pruebas',
        new Date(2025, 4, 21),
        new Date(2025, 4, 25),
        0,
        20,
        'T2',
      ],
    ],
    columns: [
      'ID',
      'Tarea',
      'Inicio',
      'Fin',
      'Duración',
      'Porcentaje',
      'Dependencias',
    ],
    options: {},
  };

  barChatNg2 = {
    chartType: "'bar'",
    chartData:  {
      labels: ['Label 1', 'Label 2', 'Label 3'],
      datasets: [{ data: [10, 20, 30], label: 'Series A' }],
    },
    chartOptions: {
    },
  };

  barChat2Ng2 = {
    chartType: "'bar'",
    chartData:  {
      labels: ['Label 1', 'Label 2', 'Label 3'],
      datasets: [{ data: [10, 20, 30], label: 'Series A' }],
    },
    chartOptions: {
        
      },
  }
}
