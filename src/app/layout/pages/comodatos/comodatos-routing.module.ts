import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComodatosComponent } from './comodatos.component';
import { CrearComodatoComponent } from './crear-comodato/crear-comodato.component';
import { VerComodatoComponent } from './ver-comodato/ver-comodato.component';

const routes: Routes = [
  {
    path: '', component: ComodatosComponent
  },
  {
    path:'crearcomodato', component: CrearComodatoComponent,
  },
  {
    path:'vercomodatos', component: VerComodatoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComodatosRoutingModule { }
