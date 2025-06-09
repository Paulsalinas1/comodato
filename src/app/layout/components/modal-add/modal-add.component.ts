import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Campo } from '../../../core/models/Campo';
import { Categoria } from '../../../core/models/categoria';
import { Marca } from '../../../core/models/Marca';
import { Modelo } from '../../../core/models/Modelo';

@Component({
  selector: 'app-modal-add',
  standalone: false,
  templateUrl: './modal-add.component.html',
  styleUrl: './modal-add.component.css'
})
export class ModalAddComponent {

  form!: FormGroup;
  pasoActual = 0; // Paso activo inicial
  campos: Campo[] = [];
  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  marcasFiltradas: Marca[] = [];
  modelos: Modelo[] = [];
  modelosFiltrados: Modelo[] = [];


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titulo: string,
      pasos: string[];
      campos: Campo[];
      categorias: Categoria[];
      modelos: Modelo[];
      marcas: Marca[],
    }
  ) {}

  ngOnInit(): void {
    const group: any = {};
    this.campos = [...this.data.campos];
    this.categorias = this.data.categorias;
    this.modelos = this.data.modelos;
    this.marcas = this.data.marcas;

    this.data.campos.forEach(campo => {
      const validators = campo.obligatorio ? [Validators.required] : [];
      group[campo.nombre] = this.fb.control('', validators);
    });
    this.form = this.fb.group(group);

    // Al cambiar la categoría filtras marcas y modelos
    this.form.get('Categoria_idCategoria')?.valueChanges.subscribe(idCategoria => {
      
      this.filtrarMarcasPorCategoria(idCategoria);
      this.filtrarModelosPorCategoria(idCategoria);
      this.form.get('Marca_idMarca')?.reset();
      this.form.get('Modelo_idModelo')?.reset();
      
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


filtrarMarcasPorCategoria(idCategoria: string) {
    // Suponiendo que tus marcas tienen idCategoria
    if(!idCategoria){
      this.marcasFiltradas = [];
    }else{
      this.marcasFiltradas = this.marcas.filter(m => m.Categoria_idCategoria === idCategoria);
    }
    const marcaCampo = this.campos.find(c => c.nombre === 'Marca_idMarca');
    if (marcaCampo) {
      marcaCampo.opciones = this.marcasFiltradas.map(m => ({
        valor: m.idMarca,
        texto: m.nombreMarca,
      }));
    }
  }

  filtrarModelosPorCategoria(idCategoria: string ) {
    if (!idCategoria) {
      this.modelosFiltrados = [];
    } else {
      this.modelosFiltrados = this.modelos.filter(m => m.Categoria_idCategoria === idCategoria);
    }
    const modeloCampo = this.campos.find(c => c.nombre === 'Modelo_idModelo');
    if (modeloCampo) {
      modeloCampo.opciones = this.modelosFiltrados.map(m => ({
        valor: m.idModelo,
        texto: m.nombreModelo,
      }));
    }
  }
}
