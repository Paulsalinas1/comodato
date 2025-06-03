import { Component, Inject } from '@angular/core';
import { Categoria } from '../../../core/models/categoria';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-cat',
  standalone: false,
  templateUrl: './modal-cat.component.html',
  styleUrl: './modal-cat.component.css'
})
export class ModalCatComponent {
categoria: Categoria;

  constructor(
    public dialogRef: MatDialogRef<ModalCatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoria: Categoria }
  ) {
    this.categoria = { ...data.categoria }; // copia para editar sin afectar la original
  }

  guardarCambios() {
    this.dialogRef.close({ accion: 'editar', categoria: this.categoria });
  }

  eliminarCategoria() {
    this.dialogRef.close({ accion: 'eliminar', categoria: this.categoria });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
