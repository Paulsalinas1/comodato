import { Component } from '@angular/core';

@Component({
  selector: 'app-crear-comodato',
  standalone: false,
  templateUrl: './crear-comodato.component.html',
  styleUrl: './crear-comodato.component.css'
})
export class CrearComodatoComponent {
pasoActual = 0;

pasos = [
  { titulo: 'Personal Info', descripcion: 'Step details here', icono: 'check_circle', estado: 'completado' },
  { titulo: 'Account Info', descripcion: 'Step details here', icono: 'group', estado: 'activo' },
  { titulo: 'Review', descripcion: 'Step details here', icono: 'assignment', estado: 'pendiente' },
  { titulo: 'Confirmation', descripcion: 'Step details here', icono: 'fact_check', estado: 'pendiente' },
];

siguientePaso() {
  if (this.pasoActual < this.pasos.length - 1) {
    this.pasos[this.pasoActual].estado = 'completado';
    this.pasoActual++;
    this.pasos[this.pasoActual].estado = 'activo';
  }
}

anteriorPaso() {
  if (this.pasoActual > 0) {
    this.pasos[this.pasoActual].estado = 'pendiente';
    this.pasoActual--;
    this.pasos[this.pasoActual].estado = 'activo';
  }
}


}
