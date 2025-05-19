import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  
chartData: ChartConfiguration<'bar'>['data'] = {
  labels: ['Enero', 'Febrero', 'Marzo'],
  datasets: [
    { data: [10, 20, 30], label: 'Ventas' }
  ]
};

chartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
};
}
