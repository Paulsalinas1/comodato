import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ChartType } from 'angular-google-charts';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddComponent } from '../../components/modal-add/modal-add.component';
import { ModalDesComponent } from '../../components/modal-des/modal-des.component';


@Component({
  selector: 'app-articulos',
  standalone: false,
  templateUrl: './articulos.component.html',
  styleUrl: './articulos.component.css',
})
export class ArticulosComponent {
  // Fechas y paginación
  today = new Date();

  pageSizeOptions = [1, 5, 10, 25];

  // Configuración de paginación para categorías
  categoriasPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  // Datos
  categorias: Categoria[] = [];
  

  // Filtros
  filtroCategorias: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarDatosCat();
  }

  cargarDatosCat(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.actualizarLongitudCategorias();
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      },
    });
  }

  // Filtrado y paginación de categorías
  get categoriasFiltradas(): Categoria[] {
    const texto = this.filtroCategorias.trim().toLowerCase();
    if (!texto) return this.categorias;

    return this.categorias.filter((categoria) =>
      Object.values(categoria).some((val) =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get categoriasPaginadas(): Categoria[] {
    this.categoriasPaginator.length = this.categoriasFiltradas.length;
    const startIndex =
      this.categoriasPaginator.pageIndex * this.categoriasPaginator.pageSize;
    return this.categoriasFiltradas.slice(
      startIndex,
      startIndex + this.categoriasPaginator.pageSize
    );
  }

  onPageChangeCategorias(event: PageEvent): void {
    this.categoriasPaginator.pageIndex = event.pageIndex;
    this.categoriasPaginator.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-categorias')
        ?.scrollIntoView({ behavior: 'instant' });
    }, 0);
  }

  private actualizarLongitudCategorias(): void {
    this.categoriasPaginator.length = this.categorias.length;
  }

  //modal de agragar categorias
  abrirModalNuevaCategoria() {
    const dialogRef = this.dialog.open(ModalAddComponent, {
      width: '400px',
      data: {
        titulo: 'Crear Nueva Categoría',
        campos: [
          {
            tipo: 'text',
            nombre: 'nombreCategoria',
            etiqueta: 'Nombre',
            obligatorio: true,
          },
          {
            tipo: 'text',
            nombre: 'desCategoria',
            etiqueta: 'Descripción',
            obligatorio: false,
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Aquí llamas al servicio para guardar la nueva categoría
        this.categoriaService.addCategoria(result).subscribe({
          next: () => {
            this.cargarDatosCat(); // refresca la lista después de agregar
          },
          error: (err) => {
            console.error('Error al agregar categoría:', err);
          },
        });
      }
    });
  }

  //modal de editar y eliminar categorias
  abrirModalEditarCategoria(categoria: any) {
    const dialogRef = this.dialog.open(ModalDesComponent, {
      width: '600px',
      height: '', 
      data: {
        titulo: 'Editar Categoría',
        pasos: [
          'Informacion basica',
          
        ],
        campos: [
          { tipo: 'text', nombre: 'nombreCategoria', etiqueta: 'Nombre', obligatorio: true, paso: 0 },
          { tipo: 'textarea', nombre: 'desCategoria', etiqueta: 'Descripción', obligatorio: false, paso: 0 },
          {tipo: 'select', nombre: 'selecCat', etiqueta: 'seleccion',obligatorio:false,paso:0,
            opciones: [
            { valor: '', texto: 'Seleccione un estado' },
            { valor: 'BUENO', texto: 'BUENO' },
            { valor: 'REGULAR', texto: 'REGULAR' },
            { valor: 'MALO', texto: 'MALO' }
          ]
          }
        ],
        valoresIniciales: categoria
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        if (resultado.eliminar) {
          this.categoriaService.deleteCategoria(categoria.idCategoria).subscribe(() => {
            this.cargarDatosCat();
          });
        } else {
          this.categoriaService.updateCategoria(categoria.idCategoria, resultado).subscribe(() => {
            this.cargarDatosCat();
          });
        }
      }
    });
  }
}
