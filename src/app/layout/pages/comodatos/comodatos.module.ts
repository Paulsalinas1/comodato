import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComodatosRoutingModule } from './comodatos-routing.module';
import { ComodatosComponent } from './comodatos.component';


@NgModule({
  declarations: [
    ComodatosComponent
  ],
  imports: [
    CommonModule,
    ComodatosRoutingModule
  ]
})
export class ComodatosModule { }
