import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticulosComponent } from './articulos.component';
import { ListaComponent } from './lista/lista.component';

const routes: Routes = [
  {path:'', component: ArticulosComponent}, 
  {path:'lista',component: ListaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticulosRoutingModule { }
