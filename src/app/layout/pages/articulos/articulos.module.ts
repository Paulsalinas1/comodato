import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticulosRoutingModule } from './articulos-routing.module';
import { ArticulosComponent } from './articulos.component';
import { LayoutModule } from '../../layout.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    ArticulosComponent,
  ],
  imports: [
    CommonModule,
    ArticulosRoutingModule,
    LayoutModule,
    GoogleChartsModule,
    NgxPaginationModule,
    FormsModule,
    MatPaginatorModule,
  ]
})
export class ArticulosModule { }
