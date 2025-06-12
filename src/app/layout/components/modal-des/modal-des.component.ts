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
  templateUrl: './modal-des.component.html',
  styleUrl: './modal-des.component.css',
})
export class ModalDesComponent implements OnInit {
  form!: FormGroup;
  pasoActual = 0;
  campos: Campo[] = [];

  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  marcasFiltradas: Marca[] = [];
  modelosFiltrados: Modelo[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalDesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
      pasos: string[];
      campos: Campo[];
      categorias: Categoria[];
      marcas: Marca[];
      modelos: Modelo[];
      valoresIniciales?: { [key: string]: any };
    }
  ) {}

  ngOnInit(): void {
    this.campos = [...this.data.campos];
    this.categorias = this.data.categorias;
    this.marcas = this.data.marcas;
    this.modelos = this.data.modelos;

    const group: any = {};
    this.campos.forEach((campo) => {
      const validators = campo.obligatorio ? [Validators.required] : [];
      const valorInicial = this.data.valoresIniciales?.[campo.nombre] ?? '';
      group[campo.nombre] = this.fb.control(valorInicial, validators);
    });

    this.form = this.fb.group(group);

    // Detectar cambios en la categoría
    this.form.get('Categoria_idCategoria')?.valueChanges.subscribe((id) => {
      this.filtrarMarcas(id);
      this.filtrarModelos(id);
      this.form.get('Marca_idMarca')?.reset();
      this.form.get('Modelo_idModelo')?.reset();
    });

    // Si ya hay categoría, filtrar marcas/modelos para mostrar los correctos al cargar
    const idCategoriaInicial = this.form.get('Categoria_idCategoria')?.value;
    if (idCategoriaInicial) {
      this.filtrarMarcas(idCategoriaInicial);
      this.filtrarModelos(idCategoriaInicial);
    }

    // Cargar opciones en campos
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
    // Para los campos select que no dependen de la categoría
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
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  eliminar() {
    this.dialogRef.close({ eliminar: true });
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
    // Opcional: lógica para agregar opciones desde el modal
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
    // Opcional: validación para evitar cambiar si hay errores
    this.pasoActual = indice;
  }
}
