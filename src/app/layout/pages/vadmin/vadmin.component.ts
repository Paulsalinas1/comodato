import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
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
  styleUrl: './vadmin.component.css'
})
export class VadminComponent {
  listaAdmins: any[] = [];
  modo: 'crear' | 'editar' = 'crear';
  formAdmin: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.formAdmin = this.fb.group({
      idAdmin: ['', Validators.required],
      nombreAdmin: ['', Validators.required],
      passAdmin: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarAdmins();
  }

  cargarAdmins() {
    this.adminService.obtenerAdmins().subscribe((data: any) => {
      this.listaAdmins = data as any[];
    });
  }

  abrirModal(modo: 'crear' | 'editar', admin?: any) {
    this.modo = modo;
    if (modo === 'editar' && admin) {
      this.formAdmin.patchValue(admin);
    } else {
      this.formAdmin.reset();
    }
    const modal = new bootstrap.Modal(document.getElementById('adminModal')!);
    modal.show();
  }

  guardarAdmin() {
    const admin = this.formAdmin.value;
    if (this.modo === 'crear') {
      this.adminService.crearAdmin(admin).subscribe(() => this.cargarAdmins());
    } else {
      this.adminService.actualizarAdmin(admin.idAdmin, admin).subscribe(() => this.cargarAdmins());
    }
    bootstrap.Modal.getInstance(document.getElementById('adminModal')!)?.hide();
  }

  editar(admin: any) {
    this.abrirModal('editar', admin);
  }

  eliminar(idAdmin: string) {
    if (confirm('¿Seguro que deseas eliminar este administrador?')) {
      this.adminService.eliminarAdmin(idAdmin).subscribe(() => this.cargarAdmins());
    }
  }
}
