import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VadminRoutingModule } from './vadmin-routing.module';
import { VadminComponent } from '../vadmin/vadmin.component';


@NgModule({
  declarations: [
    VadminComponent
  ],
  imports: [
    CommonModule,
    VadminRoutingModule
  ]
})
export class VadminModule { }
