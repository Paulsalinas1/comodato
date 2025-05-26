import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComodatosRoutingModule } from './comodatos-routing.module';
import { ComodatosComponent } from './comodatos.component';
import { LayoutModule } from '../../layout.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CrearComodatoComponent } from './crear-comodato/crear-comodato.component';
import { VerComodatoComponent } from './ver-comodato/ver-comodato.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule , MatNativeDateModule} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    ComodatosComponent,
    CrearComodatoComponent,
    VerComodatoComponent
  ],
  imports: [
    CommonModule,
    ComodatosRoutingModule,
    LayoutModule,
    GoogleChartsModule,
    NgxPaginationModule,
    FormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule

  ]
})
export class ComodatosModule { }
