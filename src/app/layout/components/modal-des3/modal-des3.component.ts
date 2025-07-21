import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Campo } from '../../../core/models/Campo';
import { Marca } from '../../../core/models/Marca';
import { Modelo } from '../../../core/models/Modelo';
import { Categoria } from '../../../core/models/categoria';

@Component({
  selector: 'app-modal-des',
  standalone: false,
  templateUrl: './modal-des3.component.html',
  styleUrl: './modal-des3.component.css',
})
export class ModalDes3Component implements OnInit {
  form!: FormGroup;
  pasoActual = 0;
  campos: Campo[] = [];

  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  marcasFiltradas: Marca[] = [];
  modelosFiltrados: Modelo[] = [];

  soloLectura = false; // 👈 nuevo flag

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalDes3Component>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
      pasos: string[];
      campos: Campo[];
      categorias?: Categoria[];
      marcas?: Marca[];
      modelos?: Modelo[];
      valoresIniciales?: { [key: string]: any };
      soloLectura?: boolean; // 👈 nuevo parámetro
    }
  ) {}

  ngOnInit(): void {
    this.campos = [...this.data.campos];
    this.categorias = this.data.categorias ?? [];
    this.marcas = this.data.marcas ?? [];
    this.modelos = this.data.modelos ?? [];
    this.soloLectura = this.data.soloLectura === true;

    const group: any = {};
    this.campos.forEach((campo) => {
      const validators = campo.obligatorio && !this.soloLectura ? [Validators.required] : [];
      const valorInicial = this.data.valoresIniciales?.[campo.nombre] ?? '';
      group[campo.nombre] = this.fb.control(
        { value: valorInicial, disabled: this.soloLectura || campo.soloLectura === true },
        validators
      );
    });

    this.form = this.fb.group(group);

    this.form.get('Categoria_idCategoria')?.valueChanges.subscribe((id) => {
      this.filtrarMarcas(id);
      this.filtrarModelos(id);
      this.form.get('Marca_idMarca')?.reset();
      this.form.get('Modelo_idModelo')?.reset();
    });

    const idCategoriaInicial = this.form.get('Categoria_idCategoria')?.value;
    if (idCategoriaInicial) {
      this.filtrarMarcas(idCategoriaInicial);
      this.filtrarModelos(idCategoriaInicial);
    }

    this.actualizarOpciones();
  }

  filtrarMarcas(idCategoria: string | null) {
    this.marcasFiltradas = idCategoria
      ? this.marcas.filter((m) => m.Categoria_idCategoria === idCategoria)
      : [];

    const campoMarca = this.campos.find((c) => c.nombre === 'Marca_idMarca');
    if (campoMarca) {
      campoMarca.opciones = this.marcasFiltradas.map((m) => ({
        valor: m.idMarca,
        texto: m.nombreMarca,
      }));
    }
  }

  filtrarModelos(idCategoria: string | null) {
    this.modelosFiltrados = idCategoria
      ? this.modelos.filter((m) => m.Categoria_idCategoria === idCategoria)
      : [];

    const campoModelo = this.campos.find((c) => c.nombre === 'Modelo_idModelo');
    if (campoModelo) {
      campoModelo.opciones = this.modelosFiltrados.map((m) => ({
        valor: m.idModelo,
        texto: m.nombreModelo,
      }));
    }
  }

  actualizarOpciones() {
    this.campos.forEach((campo) => {
      if (campo.nombre === 'Categoria_idCategoria') {
        campo.opciones = this.categorias.map((c) => ({
          valor: c.idCategoria,
          texto: c.nombreCategoria,
        }));
      }
    });
  }

  guardar() {
    if (this.soloLectura) return; 
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  descargar(tipodescarga: string ){
    this.dialogRef.close(tipodescarga);
  }

  Rcomodato() {
    this.dialogRef.close('RenovarComodato');
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

  agregarOpcion(campo: Campo) {
    if (this.soloLectura) return; // 👈 evitar agregar si es solo lectura
    if (campo.nombre === 'Categoria_idCategoria') {
      this.dialogRef.close({ agregarCategoria: true });
    }
    if (campo.nombre === 'Modelo_idModelo') {
      this.dialogRef.close({ agregarModelo: true });
    }
    if (campo.nombre === 'Marca_idMarca') {
      this.dialogRef.close({ agregarMarca: true });
    }
  }

  irAlPaso(indice: number): void {
    this.pasoActual = indice;
  }
}
