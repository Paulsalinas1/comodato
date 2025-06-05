import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Campo } from '../../../core/models/Campo';

@Component({
  selector: 'app-modal-add',
  standalone: false,
  templateUrl: './modal-add.component.html',
  styleUrl: './modal-add.component.css'
})
export class ModalAddComponent {

  form!: FormGroup;
  pasoActual = 0; // Paso activo inicial

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titulo: string,
      pasos: string[];
      campos: Campo[];
    }
  ) {}

  ngOnInit(): void {
    const group: any = {};
    this.data.campos.forEach(campo => {
      const validators = campo.obligatorio ? [Validators.required] : [];
      group[campo.nombre] = this.fb.control('', validators);
    });
    this.form = this.fb.group(group);
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  agregarOpcion(){
    
  }

  siguientePaso() {
  if (this.pasoActual < this.data.pasos.length - 1) {
    this.pasoActual++;
  }
}

anteriorPaso() {
  if (this.pasoActual > 0) {
    this.pasoActual--;
  }
}

}
