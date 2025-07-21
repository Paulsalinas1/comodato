import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ModalService } from '../../../core/services/modal.service';
declare var bootstrap: any;
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
  styleUrl: './vadmin.component.css',
})
export class VadminComponent implements OnInit {
  listaAdmins: any[] = [];
  mostrarPassword: boolean = false;

  private modalActivo = inject(ModalService)
  formAdmin: FormGroup;
  modo: 'crear' | 'editar' = 'crear';

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.formAdmin = this.fb.group({
      nombreAdmin: ['', Validators.required],
      passAdmin: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cargarAdmins();

     const modalElement = document.getElementById('adminModal');

  if (modalElement) {
    modalElement.addEventListener('show.bs.modal', () => {
      this.modalActivo.activarModal();
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      this.modalActivo.desactivarModal();
    });
  }

  }

  cargarAdmins() {
    this.adminService.obtenerAdmins().subscribe((data: any) => {
      this.listaAdmins = data as any[];
    });
  }

  guardarAdmin() {
    const admin = this.formAdmin.value;
    if (this.modo === 'crear') {
      this.adminService.crearAdmin(admin).subscribe(() => this.cargarAdmins());
    } else {
      this.adminService
        .actualizarAdmin(admin.idAdmin, admin)
        .subscribe(() => this.cargarAdmins());
    }
    bootstrap.Modal.getInstance(document.getElementById('adminModal')!)?.hide();
  }

  eliminar(idAdmin: string) {
    if (idAdmin === '1') {
      alert('No se puede eliminar al administrador principal.');
      return;
    }
    if (confirm('¿Seguro que deseas eliminar este administrador?')) {
        this.adminService
          .eliminarAdmin(idAdmin)
          .subscribe(() => this.cargarAdmins());
    }
  }

  abrirModalCrear() {
    this.modo = 'crear';
    this.formAdmin.reset(); // limpia el formulario
    const modal = new bootstrap.Modal(document.getElementById('adminModal')!);
    modal.show();
  }

  editar(admin: any) {
    this.modo = 'editar';
    this.formAdmin.patchValue(admin);
    const modal = new bootstrap.Modal(document.getElementById('adminModal')!);
    modal.show();
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
