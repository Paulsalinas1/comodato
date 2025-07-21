import { Component } from '@angular/core';
import { ModalService } from '../core/services/modal.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  
})
export class LayoutComponent {
  sidebarVisible = false;
  modalActivo = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  


constructor(private modalService: ModalService) {
  this.modalService.modalActivo$.subscribe(estado => {
    console.log('Modal activo:', estado); // ¿Se imprime?
    this.modalActivo = estado;
  });
}


}
