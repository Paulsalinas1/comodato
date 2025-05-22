import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComodatosComponent } from './comodatos.component';

const routes: Routes = [
  {path: '', component: ComodatosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComodatosRoutingModule { }
