import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { GoogleChartsModule } from 'angular-google-charts';
import {BaseChartDirective} from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GoogleChartsModule,
    FormsModule,
    BaseChartDirective
  ]
})
export class DashboardModule { }
