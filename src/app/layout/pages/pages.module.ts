import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    GoogleChartsModule
  ]
})
export class PagesModule { }
