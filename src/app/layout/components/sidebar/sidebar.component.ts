import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() visible: boolean = false;

  @Output() close = new EventEmitter<void>();

  constructor(private router : Router ) {}
  onClose() {
    this.close.emit();
  }
  logout() {
    localStorage.removeItem('adminActivo'); // Elimina al usuario activo
    this.router.navigate(['/login']);       // Redirige al login
  }

}
