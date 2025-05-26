import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComodatosRoutingModule } from './comodatos-routing.module';
import { ComodatosComponent } from './comodatos.component';
import { LayoutModule } from '../../layout.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ComodatosComponent
  ],
  imports: [
    CommonModule,
    ComodatosRoutingModule,
    LayoutModule,
    GoogleChartsModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class ComodatosModule { }
