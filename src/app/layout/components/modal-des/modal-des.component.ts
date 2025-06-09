import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Campo } from '../../../core/models/Campo';


@Component({
  selector: 'app-modal-cat',
  standalone: false,
  templateUrl: './modal-des.component.html',
  styleUrl: './modal-des.component.css'
})
export class ModalDesComponent {
form!: FormGroup;
pasoActual = 0; // Paso activo inicial

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalDesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titulo: string,
      pasos: string[];
      campos: Campo[];
      valoresIniciales?: { [key: string]: any }; // Para cargar datos si es edición
    }
  ) {}

  ngOnInit(): void {
    const group: any = {};

    this.data.campos.forEach(campo => {
      const validators = campo.obligatorio ? [Validators.required] : [];
      const valorInicial = this.data.valoresIniciales?.[campo.nombre] !== undefined
                          ? this.data.valoresIniciales[campo.nombre]
                          : '';
      group[campo.nombre] = this.fb.control(valorInicial, validators);
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

  eliminar?() {
    // Opcional, si quieres manejar eliminación en el modal
    this.dialogRef.close({ eliminar: true });
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
