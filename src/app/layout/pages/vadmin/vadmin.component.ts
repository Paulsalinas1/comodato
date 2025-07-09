import { Component } from '@angular/core';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-vadmin',
  standalone: false,
  templateUrl: './vadmin.component.html',
  styleUrl: './vadmin.component.css'
})
export class VadminComponent {
  systemUsers: SystemUser[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Aquí iría la llamada a tu servicio Firebase u otro backend
    this.systemUsers = [
      { id: '1', name: 'Ana Pérez', email: 'ana@ejemplo.com', role: 'Administrador' },
      { id: '2', name: 'Carlos Ruiz', email: 'carlos@ejemplo.com', role: 'Encargado' }
    ];
  }

  openUserModal() {
    // Abre un modal o formulario para registrar un nuevo usuario
  }

  editUser(user: SystemUser) {
    // Lógica para editar un usuario
  }

  deleteUser(userId: string) {
    // Lógica para eliminar un usuario
  }
}
