import { Component } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  chartTitle = 'Ventas Mensuales';
  chartType = ChartType.PieChart;
  chartData = [
  ['Enero', 1000],
  ['Febrero', 1170],
  ['Marzo', 660]
];
  chartOptions = { legend: true };
}
