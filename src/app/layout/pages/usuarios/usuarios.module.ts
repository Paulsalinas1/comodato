import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { LayoutModule } from '../../layout.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    LayoutModule,
    GoogleChartsModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class UsuariosModule { }
