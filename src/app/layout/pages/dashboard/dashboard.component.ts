import { Component } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  chartTitle = 'Ventas Mensuales';
  chartType = ChartType.PieChart;
  chartData = [
    ['Mes', 'Ventas'],
    ['Enero', 1000],
    ['Febrero', 1170],
    ['Marzo', 660]
  ];
  chartOptions = { legend: { position: 'bottom' } };
}
