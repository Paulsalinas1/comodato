import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VadminRoutingModule } from './vadmin-routing.module';
import { VadminComponent } from '../vadmin/vadmin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    VadminComponent
  ],
  imports: [
    CommonModule,
    VadminRoutingModule,
    ReactiveFormsModule,
    MatIconModule
]
})
export class VadminModule { }
