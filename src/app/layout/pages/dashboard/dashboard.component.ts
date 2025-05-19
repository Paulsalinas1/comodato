import { Component } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  today = new Date();
  chartTitle = 'Ventas Mensuales';
  chartType = ChartType.PieChart;
  chartData = [
  ['Enero', 1000],
  ['Febrero', 1170],
  ['Marzo', 660]
];
  chartOptions = { legend:{ position: 'bottom' },
  chartArea: { width: '100%', height: '80%' }

};
}
