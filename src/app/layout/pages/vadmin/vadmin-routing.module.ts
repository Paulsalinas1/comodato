import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VadminComponent } from './vadmin.component';

const routes: Routes = [
  {
    path: '', component: VadminComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VadminRoutingModule { }
