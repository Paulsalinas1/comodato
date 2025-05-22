import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './layout/pages/page-not-found/page-not-found.component';
import { LayoutModule } from './layout/layout.module';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent]
})
export class AppModule { }
