import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalAddComponent } from './components/modal-add/modal-add.component';
import { ModalDesComponent } from './components/modal-des/modal-des.component';
import { ModalDes2Component } from './components/modal-des2/modal-des2.component';
import { MatSelectModule } from '@angular/material/select';
import { ModalComodatoComponent } from './components/modal-comodato/modal-comodato.component';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    ModalAddComponent,
    ModalDesComponent,
    ModalComodatoComponent,
    ModalDes2Component,
    
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,

  ],
  exports: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    ModalAddComponent,
    ModalDesComponent,
    ModalDes2Component
    
  ],
})
export class LayoutModule { }
