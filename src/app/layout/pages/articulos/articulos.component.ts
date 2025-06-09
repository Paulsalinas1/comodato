import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ChartType } from 'angular-google-charts';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddComponent } from '../../components/modal-add/modal-add.component';
import { ModalDesComponent } from '../../components/modal-des/modal-des.component';
import { Marca } from '../../../core/models/Marca';
import { MarcaService } from '../../../core/services/marca.service';


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

  // Configuración de paginación para marcas
  marcasPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  // Datos
  categorias: Categoria[] = [];
  marcas: Marca[] = [];

  // Filtros
  filtroCategorias: string = '';
  filtroMarcas: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private marcasService: MarcaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarDatosCat();
    this.cargarDatosMar();
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

  private actualizarLongitudCategorias(): void {
    this.categoriasPaginator.length = this.categorias.length;
  }

  cargarDatosMar(): void {
    this.marcasService.getMarcas().subscribe({
      next: (data) => {
        this.marcas = data;
        this.actualizarLongitudMarcas();
      },
      error: (err) => {
        console.error('Error al cargar marcas:', err);
      },
    });
  }

  private actualizarLongitudMarcas(): void {
    this.marcasPaginator.length = this.marcas.length;
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

  // Filtrado y paginación de marcas
  get marcasFiltradas(): Marca[] {
    const texto = this.filtroMarcas.trim().toLowerCase();
    if (!texto) return this.marcas;

    return this.marcas.filter((Marca) =>
      Object.values(Marca).some((val) =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get marcasPaginadas(): Marca[] {
    this.marcasPaginator.length = this.marcasFiltradas.length;
    const startIndex =
      this.marcasPaginator.pageIndex * this.marcasPaginator.pageSize;
    return this.marcasFiltradas.slice(
      startIndex,
      startIndex + this.marcasPaginator.pageSize
    );
  }

  onPageChangeMarcas(event: PageEvent): void {
    this.marcasPaginator.pageIndex = event.pageIndex;
    this.marcasPaginator.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-marcas')
        ?.scrollIntoView({ behavior: 'instant' });
    }, 0);
  }

  //modal de agragar categorias
  abrirModalNuevaCategoria() {
    const dialogRef = this.dialog.open(ModalAddComponent, {
      width: '400px',
      data: {
        titulo: 'Crear Nueva Categoría',
        pasos: ['Informacion basica'],
        campos: [
          {
            tipo: 'text',
            nombre: 'nombreCategoria',
            etiqueta: 'Nombre',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'text',
            nombre: 'desCategoria',
            etiqueta: 'Descripción',
            obligatorio: false,
            paso: 0,
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
        pasos: ['Informacion basica'],
        campos: [
          {
            tipo: 'text',
            nombre: 'nombreCategoria',
            etiqueta: 'Nombre',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'textarea',
            nombre: 'desCategoria',
            etiqueta: 'Descripción',
            obligatorio: false,
            paso: 0,
          },
        ],
        valoresIniciales: categoria,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        if (resultado.eliminar) {
          this.categoriaService
            .deleteCategoria(categoria.idCategoria)
            .subscribe(() => {
              this.cargarDatosCat();
            });
        } else {
          this.categoriaService
            .updateCategoria(categoria.idCategoria, resultado)
            .subscribe(() => {
              this.cargarDatosCat();
            });
        }
      }
    });
  }

  //modal de agregar marcas
  abrirModalNuevaMarca() {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        const dialogRef = this.dialog.open(ModalAddComponent, {
          width: '400px',
          data: {
            titulo: 'Crear Nueva Marca',
            pasos: ['Información básica'],
            campos: [
              {
                tipo: 'text',
                nombre: 'nombreMarca',
                etiqueta: 'Nombre',
                obligatorio: true,
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'desMarca',
                etiqueta: 'Descripción',
                obligatorio: false,
                paso: 0,
              },
              {
                tipo: 'select',
                nombre: 'Categoria_idCategoria',
                etiqueta: 'Categoría',
                obligatorio: true,
                paso: 0,
                opciones: categorias.map((cat) => ({
                  valor: cat.idCategoria,
                  texto: cat.nombreCategoria,
                })),
              },
            ],
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.marcasService.createMarca(result).subscribe({
              next: () => this.cargarDatosMar(),
              error: (err) => console.error('Error al agregar marca:', err),
            });
          }
        });
      },
      error: (err) => console.error('Error al cargar categorías:', err),
    });
  }

abrirModalEditarMarca(marca: any) {
  // Primero cargamos las categorías (suponiendo que tienes un servicio para eso)
  this.categoriaService.getCategorias().subscribe((categorias) => {
    const dialogRef = this.dialog.open(ModalDesComponent, {
      width: '600px',
      data: {
        titulo: 'Editar Marca',
        pasos: ['Información básica'],
        campos: [
          {
            tipo: 'text',
            nombre: 'nombreMarca',
            etiqueta: 'Nombre',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'textarea',
            nombre: 'desMarca',
            etiqueta: 'Descripción',
            obligatorio: false,
            paso: 0,
          },
          {
            tipo: 'select',
            nombre: 'Categoria_idCategoria',
            etiqueta: 'Categoría',
            obligatorio: true,
            paso: 0,
            opciones: categorias.map(cat => ({
              valor: cat.idCategoria,
              texto: cat.nombreCategoria,
            })),
          }
        ],
        valoresIniciales: marca,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        if (resultado.eliminar) {
          this.marcasService.deleteMarca(marca.idMarca).subscribe(() => {
            this.cargarDatosMar();
          });
        } else {
          this.marcasService.updateMarca(marca.idMarca, resultado).subscribe(() => {
            this.cargarDatosMar();
          });
        }
      }
    });
  });
}


}
