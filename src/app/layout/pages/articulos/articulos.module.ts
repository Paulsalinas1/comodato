import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticulosRoutingModule } from './articulos-routing.module';
import { ArticulosComponent } from './articulos.component';
import { LayoutModule } from '../../layout.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';




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
    MatIconModule,
    MatSnackBarModule
    
  ]
})
export class ArticulosModule { }
