import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComodatosRoutingModule } from './comodatos-routing.module';
import { LayoutModule } from '../../layout.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ComodatosComponent } from './comodatos.component';

@NgModule({
  declarations: [
    ComodatosComponent,

  ],
  imports: [
    CommonModule,
    ComodatosRoutingModule,
        
        LayoutModule,
        GoogleChartsModule,
        NgxPaginationModule,
        FormsModule,
        MatPaginatorModule,
        MatIconModule,
        MatSnackBarModule

  ]
})
export class ComodatosModule { }
