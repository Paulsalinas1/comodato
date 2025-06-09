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
import { ModeloService } from '../../../core/services/modelo.service';
import { Articulo } from '../../../core/models/articulo';
import { ArticulosService } from '../../../core/services/articulos.service';
import { Modelo } from '../../../core/models/Modelo';
import { forkJoin } from 'rxjs';

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

  // Configuración de paginación para modelos
  modelosPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  // Configuración de paginación para modelos
  articulosPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  // Datos
  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  modelos: Modelo[] = [];
  articulos: Articulo[] = [];

  // Filtros
  filtroCategorias: string = '';
  filtroMarcas: string = '';
  filtroModelos: string = '';
  filtroArticulos: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private marcasService: MarcaService,
    private modeloService: ModeloService,
    private articuloService: ArticulosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarDatosCat();
    this.cargarDatosMar();
    this.cargarDatosMod();
    this.cargarDatosArti();
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

  cargarDatosMod(): void {
    this.modeloService.getModelos().subscribe({
      next: (data) => {
        this.modelos = data;
        this.actualizarLongitudModelos();
      },
      error: (err) => {
        console.error('Error al cargar modelos:', err);
      },
    });
  }

  private actualizarLongitudModelos(): void {
    this.modelosPaginator.length = this.modelos.length;
  }

  cargarDatosArti(): void {
    this.articuloService.getArticulos().subscribe({
      next: (data) => {
        this.articulos = data;
        this.actualizarLongitudArticulos();
      },
      error: (err) => {
        console.error('Error al cargar articulos:', err);
      },
    });
  }

  private actualizarLongitudArticulos(): void {
    this.articulosPaginator.length = this.articulos.length;
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

    return this.marcas.filter((marca) =>
      Object.values(marca).some((val) =>
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

  // Filtrado y paginación de modelos
  get modelosFiltradas(): Modelo[] {
    const texto = this.filtroModelos.trim().toLowerCase();
    if (!texto) return this.modelos;

    return this.modelos.filter((modelo) =>
      Object.values(modelo).some((val) =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get modelosPaginadas(): Modelo[] {
    this.modelosPaginator.length = this.modelosFiltradas.length;
    const startIndex =
      this.modelosPaginator.pageIndex * this.modelosPaginator.pageSize;
    return this.modelosFiltradas.slice(
      startIndex,
      startIndex + this.modelosPaginator.pageSize
    );
  }

  onPageChangeModelos(event: PageEvent): void {
    this.modelosPaginator.pageIndex = event.pageIndex;
    this.modelosPaginator.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-modelos')
        ?.scrollIntoView({ behavior: 'instant' });
    }, 0);
  }

  // Filtrado y paginación de Articulos
  get articulosFiltradas(): Articulo[] {
    const texto = this.filtroArticulos.trim().toLowerCase();
    if (!texto) return this.articulos;

    return this.articulos.filter((articulo) =>
      Object.values(articulo).some((val) =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get articulosPaginadas(): Articulo[] {
    this.articulosPaginator.length = this.articulosFiltradas.length;
    const startIndex =
      this.articulosPaginator.pageIndex * this.articulosPaginator.pageSize;
    return this.articulosFiltradas.slice(
      startIndex,
      startIndex + this.articulosPaginator.pageSize
    );
  }

  onPageChangeArticulos(event: PageEvent): void {
    this.articulosPaginator.pageIndex = event.pageIndex;
    this.articulosPaginator.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-articulos')
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

  //modal de editar y eliminar marcas
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
              opciones: categorias.map((cat) => ({
                valor: cat.idCategoria,
                texto: cat.nombreCategoria,
              })),
            },
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
            this.marcasService
              .updateMarca(marca.idMarca, resultado)
              .subscribe(() => {
                this.cargarDatosMar();
              });
          }
        }
      });
    });
  }

  //modal de agregar modelo
  abrirModalNuevaModelo() {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        const dialogRef = this.dialog.open(ModalAddComponent, {
          width: '400px',
          data: {
            titulo: 'Crear Nuevo Modelo',
            pasos: ['Información básica'],
            campos: [
              {
                tipo: 'text',
                nombre: 'nombreModelo',
                etiqueta: 'Nombre',
                obligatorio: true,
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'desModelo',
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
            this.modeloService.createModelo(result).subscribe({
              next: () => this.cargarDatosMod(),
              error: (err) => console.error('Error al agregar modelo:', err),
            });
          }
        });
      },
      error: (err) => console.error('Error al cargar categorías:', err),
    });
  }

  //modal de editar y eliminar modelo
  abrirModalEditarModelo(modelo: any) {
    // Primero cargamos las categorías (suponiendo que tienes un servicio para eso)
    this.categoriaService.getCategorias().subscribe((categorias) => {
      const dialogRef = this.dialog.open(ModalDesComponent, {
        width: '600px',
        data: {
          titulo: 'Editar Modelo',
          pasos: ['Información básica'],
          campos: [
            {
              tipo: 'text',
              nombre: 'nombreModelo',
              etiqueta: 'Nombre',
              obligatorio: true,
              paso: 0,
            },
            {
              tipo: 'textarea',
              nombre: 'desModelo',
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
          valoresIniciales: modelo,
        },
      });

      dialogRef.afterClosed().subscribe((resultado) => {
        if (resultado) {
          if (resultado.eliminar) {
            this.modeloService.deleteModelo(modelo.idModelo).subscribe(() => {
              this.cargarDatosMod();
            });
          } else {
            this.modeloService
              .updateModelo(modelo.idModelo, resultado)
              .subscribe(() => {
                this.cargarDatosMod();
              });
          }
        }
      });
    });
  }

  // Modal para agregar un nuevo artículo
  abrirModalNuevoArticulo() {
    forkJoin({
      categorias: this.categoriaService.getCategorias(),
      marcas: this.marcasService.getMarcas(),
      modelos: this.modeloService.getModelos(),
    }).subscribe({
      next: ({ categorias, marcas, modelos }) => {
        const dialogRef = this.dialog.open(ModalAddComponent, {
          width: '600px',
          data: {
            titulo: 'Crear Nuevo Artículo',
            pasos: [
              'Información básica',
              'Estado y disponibilidad',
              'Clasificación',
            ],
            campos: [
              // Paso 0: Información básica
              {
                tipo: 'text',
                nombre: 'nombreArticulo',
                etiqueta: 'Nombre',
                obligatorio: true,
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'desArticulo',
                etiqueta: 'Descripción',
                obligatorio: false,
                paso: 0,
              },

              // Paso 1: Estado y disponibilidad
              {
                tipo: 'select',
                nombre: 'estadoArticulo',
                etiqueta: 'Estado',
                obligatorio: true,
                paso: 1,
                opciones: [
                  { valor: 'FUNCIONAL', texto: 'Funcional' },
                  { valor: 'MANTENIMIENTO', texto: 'Mantenimiento' },
                  { valor: 'DEFECTUOSO', texto: 'Defectuoso' },
                ],
              },
              {
                tipo: 'select',
                nombre: 'dispArticulo',
                etiqueta: 'Disponibilidad',
                obligatorio: true,
                paso: 1,
                opciones: [
                  { valor: 'DISPONIBLE', texto: 'Disponible' },
                  { valor: 'EN_COMODATO', texto: 'En Comodato' },
                  { valor: 'RESERVADO', texto: 'Reservado' },
                ],
              },
              {
                tipo: 'text',
                nombre: 'numSerieArticulo',
                etiqueta: 'Número de Serie',
                obligatorio: true,
                paso: 0,
              },

              // Paso 2: Clasificación
              {
                tipo: 'select',
                nombre: 'Categoria_idCategoria',
                etiqueta: 'Categoría',
                obligatorio: true,
                paso: 2,
                opciones: categorias.map((c) => ({
                  valor: c.idCategoria,
                  texto: c.nombreCategoria,
                })),
              },
              {
                tipo: 'select',
                nombre: 'Marca_idMarca',
                etiqueta: 'Marca',
                obligatorio: true,
                paso: 2,
                opciones: [], // Se llenará dinámicamente
              },
              {
                tipo: 'select',
                nombre: 'Modelo_idModelo',
                etiqueta: 'Modelo',
                obligatorio: true,
                paso: 2,
                opciones: [], // Se llenará dinámicamente
              },
            ],
            marcas,
            modelos,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.articuloService.createArticulo(result).subscribe({
              next: () => this.cargarDatosArti(),
              error: (err) => console.error('Error al agregar artículo:', err),
            });
          }
        });
      },
      error: (err) =>
        console.error('Error al cargar datos para el formulario:', err),
    });
  }

  // Modal para editar y eliminar artículo
  abrirModalEditarArticulo(articulo: any) {
    forkJoin({
      categorias: this.categoriaService.getCategorias(),
      marcas: this.marcasService.getMarcas(),
      modelos: this.modeloService.getModelos(),
    }).subscribe(({ categorias, marcas, modelos }) => {
      const dialogRef = this.dialog.open(ModalDesComponent, {
        width: '600px',
        data: {
          titulo: 'Editar Artículo',
          pasos: ['Información básica'],
          campos: [
            {
              tipo: 'text',
              nombre: 'nombreArticulo',
              etiqueta: 'Nombre',
              obligatorio: true,
              paso: 0,
            },
            {
              tipo: 'textarea',
              nombre: 'desArticulo',
              etiqueta: 'Descripción',
              obligatorio: false,
              paso: 0,
            },
            {
              tipo: 'select',
              nombre: 'estadoArticulo',
              etiqueta: 'Estado',
              obligatorio: true,
              paso: 0,
              opciones: [
                { valor: 'FUNCIONAL', texto: 'Funcional' },
                { valor: 'MANTENIMIENTO', texto: 'Mantenimiento' },
                { valor: 'DEFECTUOSO', texto: 'Defectuoso' },
              ],
            },
            {
              tipo: 'select',
              nombre: 'dispArticulo',
              etiqueta: 'Disponibilidad',
              obligatorio: true,
              paso: 0,
              opciones: [
                { valor: 'DISPONIBLE', texto: 'Disponible' },
                { valor: 'EN_COMODATO', texto: 'En Comodato' },
                { valor: 'RESERVADO', texto: 'Reservado' },
              ],
            },
            {
              tipo: 'text',
              nombre: 'numSerieArticulo',
              etiqueta: 'Número de Serie',
              obligatorio: true,
              paso: 0,
            },
            {
              tipo: 'select',
              nombre: 'Marca_idMarca',
              etiqueta: 'Marca',
              obligatorio: true,
              paso: 0,
              opciones: marcas.map((m) => ({
                valor: m.idMarca,
                texto: m.nombreMarca,
              })),
            },
            {
              tipo: 'select',
              nombre: 'Categoria_idCategoria',
              etiqueta: 'Categoría',
              obligatorio: true,
              paso: 0,
              opciones: categorias.map((c) => ({
                valor: c.idCategoria,
                texto: c.nombreCategoria,
              })),
            },
            {
              tipo: 'select',
              nombre: 'Modelo_idModelo',
              etiqueta: 'Modelo',
              obligatorio: true,
              paso: 0,
              opciones: modelos.map((mo) => ({
                valor: mo.idModelo,
                texto: mo.nombreModelo,
              })),
            },
          ],
          valoresIniciales: articulo,
        },
      });

      dialogRef.afterClosed().subscribe((resultado) => {
        if (resultado) {
          if (resultado.eliminar) {
            this.articuloService
              .deleteArticulo(articulo.idArticulo)
              .subscribe(() => this.cargarDatosArti());
          } else {
            this.articuloService
              .updateArticulo(articulo.idArticulo, resultado)
              .subscribe(() => this.cargarDatosArti());
          }
        }
      });
    });
  }
}
