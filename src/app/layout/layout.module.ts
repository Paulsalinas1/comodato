import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalAddComponent } from './components/modal-add/modal-add.component';
import { ModalCatComponent } from './components/modal-cat/modal-cat.component';



@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    ModalAddComponent,
    ModalCatComponent,
    
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
    

  ],
  exports: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    ModalAddComponent
    
  ],
})
export class LayoutModule { }
