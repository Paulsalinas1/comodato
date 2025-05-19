import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './layout/pages/page-not-found/page-not-found.component';
import { LayoutModule } from './layout/layout.module';
import { DashboardModule } from './layout/pages/dashboard/dashboard.module';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    DashboardModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
