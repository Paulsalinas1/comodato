import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {path: 'dashboard', 
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) 
  },
  {path: 'articulos',
    loadChildren: () => import('./articulos/articulos.module').then(m => m.ArticulosModule) 
  },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
