import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  chartTitle = 'Ventas Mensuales';
  chartType = 'BarChart';
  chartData = [
    ['Mes', 'Ventas'],
    ['Enero', 1000],
    ['Febrero', 1170],
    ['Marzo', 660]
  ];
  chartColumnNames = ['Mes', 'Ventas'];
  chartOptions = { legend: { position: 'bottom' } };
}
