import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  adminNombre: string = '';

  ngOnInit() {
    const admin = JSON.parse(localStorage.getItem('adminActivo') || '{}');
    this.adminNombre = admin.nombreAdmin || 'Invitado';
  }

  onToggle() {
    this.toggleSidebar.emit();
  }
}
