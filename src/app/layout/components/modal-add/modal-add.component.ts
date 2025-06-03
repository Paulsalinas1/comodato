import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-add',
  standalone: false,
  templateUrl: './modal-add.component.html',
  styleUrl: './modal-add.component.css'
})
export class ModalAddComponent {

datos: any = {};

  constructor(
    public dialogRef: MatDialogRef<ModalAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titulo: string,
      campos: { tipo: string, nombre: string, etiqueta: string ,obligatorio: boolean}[]
    }
  ) {}

  guardar() {
    this.dialogRef.close(this.datos);
  }

  cancelar() {
    this.dialogRef.close();
  }

}
