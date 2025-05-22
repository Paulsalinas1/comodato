import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticulosRoutingModule } from './articulos-routing.module';
import { ArticulosComponent } from './articulos.component';
import { ListaComponent } from './lista/lista.component';
import { LayoutModule } from '../../layout.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ArticulosComponent,
    ListaComponent
  ],
  imports: [
    CommonModule,
    ArticulosRoutingModule,
    LayoutModule,
    GoogleChartsModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class ArticulosModule { }
