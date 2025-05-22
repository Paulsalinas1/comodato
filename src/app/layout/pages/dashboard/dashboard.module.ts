import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { GoogleChartsModule } from 'angular-google-charts';
import {BaseChartDirective} from 'ng2-charts';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GoogleChartsModule,
    BaseChartDirective
  ]
})
export class DashboardModule { }
