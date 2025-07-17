import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
import { forkJoin, map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  categoriasMap: { [id: string]: string } = {};
  marcasMap: { [id: string]: string } = {};
  modelosMap: { [id: string]: string } = {};

  // Datos presentacion
  art_totales: number = 0;
  art_dispo: number = 0;
  art_en_comodato: number = 0;
  art_no_dispo: number = 0;

  // Filtros
  filtroCategorias: string = '';
  filtroMarcas: string = '';
  filtroModelos: string = '';
  filtroArticulos: string = '';

  filtroCategoriaArticulo: string = '';
  filtroEstadoArticulo: string = '';
  filtroDisponibilidadArticulo: string = '';

  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly marcasService: MarcaService,
    private readonly modeloService: ModeloService,
    private readonly articuloService: ArticulosService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarDatosCat();
    this.cargarDatosMar();
    this.cargarDatosMod();
    this.cargarDatosArti();
    this.cargarNombres();
  }

  daots_presentacion() {
    this.art_totales = this.articulos.length;
    this.art_dispo = this.articulos.filter(
      (art) => art.dispArticulo === 'DISPONIBLE'
    ).length;
    this.art_en_comodato = this.articulos.filter(
      (art) => art.dispArticulo === 'EN_COMODATO'
    ).length;
    this.art_no_dispo = this.articulos.filter(
      (art) => art.dispArticulo === 'NO_DISPONIBLE'
    ).length;
  }

  cargarNombres(){
    this.categoriaService.getCategorias().subscribe((cats) => {
      this.categoriasMap = Object.fromEntries(
        cats.map((c) => [c.idCategoria, c.nombreCategoria])
      );
    });
    this.marcasService.getMarcas().subscribe((marcas) => {
      this.marcasMap = Object.fromEntries(
        marcas.map((m) => [m.idMarca, m.nombreMarca])
      );
    });
    this.modeloService.getModelos().subscribe((modelos) => {
      this.modelosMap = Object.fromEntries(
        modelos.map((m) => [m.idModelo, m.nombreModelo])
      );
    });
    this.articuloService.getArticulos().subscribe((items) => {
      this.articulos = items;
    });
  }

  toastComplete(result: any) {
    this.snackBar.open(result + ' sea Guardado !', 'Cerrar', {
      duration: 3000, // tiempo que se muestra en ms
      panelClass: ['snackbar-exito'], // clase CSS para estilos personalizados
      horizontalPosition: 'center', // posición horizontal: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'top', // posición vertical: 'top' | 'bottom'
    });
  }

  toastEdit(result: any) {
    this.snackBar.open(result + ' sea Editado !', 'Cerrar', {
      duration: 3000, // tiempo que se muestra en ms
      panelClass: ['snackbar-exito'], // clase CSS para estilos personalizados
      horizontalPosition: 'center', // posición horizontal: 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'top', // posición vertical: 'top' | 'bottom'
    });
  }

  toastError(result: any) {
    this.snackBar.open('Error: ' + result, 'Cerrar', {
      duration: 5000000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  toastEliminar(result: any) {
    this.snackBar.open(result + ' se a eliminado', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  cargarDatosCat(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.actualizarLongitudCategorias();
        this.daots_presentacion();
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
        this.daots_presentacion();
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
        this.daots_presentacion();
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
        this.daots_presentacion();
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
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  }

  // Filtrado y paginación de Articulos
  get articulosFiltradas(): Articulo[] {
  const texto = this.filtroArticulos.trim().toLowerCase();
  let lista = this.articulos;

  // Filtrar por categoría
  if (this.filtroCategoriaArticulo) {
    lista = lista.filter(a => a.Categoria_idCategoria === this.filtroCategoriaArticulo);
  }
  // Filtrar por estado
  if (this.filtroEstadoArticulo) {
    lista = lista.filter(a => a.estadoArticulo === this.filtroEstadoArticulo);
  }
  // Filtrar por disponibilidad
  if (this.filtroDisponibilidadArticulo) {
    lista = lista.filter(a => a.dispArticulo === this.filtroDisponibilidadArticulo);
  }

  if (!texto) return lista;

  return lista.filter((articulo) =>
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
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            this.cargarDatosCat();
            this.cargarNombres();
            this.toastComplete(result.nombreCategoria);
          },
          error: (err) => {
            this.toastError(err.error.error);
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
            .subscribe({
              next: () => {
                this.cargarDatosCat();
                this.toastEliminar(categoria.nombreCategoria);
              },
              error: (err) => {
                this.toastError(err.error.error);
              },
            });
        } else {
          this.categoriaService
            .updateCategoria(categoria.idCategoria, resultado)
            .subscribe({
              next: () => {
                this.cargarDatosCat();
                this.cargarNombres();
                this.toastComplete(categoria.nombreCategoria);
              },
              error: (err) => {
                this.toastError(err.error.error);
              },
            });
        }
      }
    });
  }

  //modal de agregar marcas
  abrirModalNuevaMarca(respaldo?: any) {
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
            respaldo: respaldo,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result?.agregarCategoria) {
            this.abrirModalCrearCategoria(result.respaldo, 'marca2');
            return;
          }
          if (result) {
            this.marcasService.createMarca(result).subscribe({
              next: () => {
                this.cargarDatosMar();
                this.cargarNombres();
                this.toastComplete(result.nombreMarca);
              },
              error: (err) => {
                console.error('Error al agregar marca:', err);
                this.toastError(err.error.error);
              },
            });
          }
        });
      },
      error: (err) => console.error('Error al cargar categorías:', err),
    });
  }

  //modal de editar y eliminar marcas
  abrirModalEditarMarca(marca: any) {
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
        if (resultado?.agregarCategoria) {
          this.abrirModalCrearCategoria(marca, 'marca');
          return;
        }
        if (resultado) {
          if (resultado.eliminar) {
            this.marcasService.deleteMarca(marca.idMarca).subscribe({
              next: () => {
                this.cargarDatosMar();
                this.toastEliminar(marca.nombreMarca);
              },
              error: (err) => {
                this.toastError(err.error.error);
              },
            });
          } else {
            this.marcasService.updateMarca(marca.idMarca, resultado).subscribe({
              next: () => {
                this.cargarDatosMar();
                this.cargarNombres();
                this.toastEdit(marca.nombreMarca);
              },
              error: (err) => {
                this.toastError(err.error.error);
              },
            });
          }
        }
      });
    });
  }

  //modal de agregar modelo
  abrirModalNuevaModelo(respaldo?: any) {
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
            respaldo: respaldo,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result?.agregarCategoria) {
            this.abrirModalCrearCategoria(result.respaldo, 'modelo2');
            return;
          }
          if (result) {
            this.modeloService.createModelo(result).subscribe({
              next: () => {
                this.cargarDatosMod();
                this.cargarNombres();
                this.toastComplete(result.nombreModelo);
              },
              error: (err) => this.toastError(err.error.error),
            });
          }
        });
      },
      error: (err) => this.toastError(err.error.error),
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
        if (resultado?.agregarCategoria) {
          this.abrirModalCrearCategoria(modelo, 'modelo');
          return;
        }
        if (resultado) {
          if (resultado.eliminar) {
            this.modeloService.deleteModelo(modelo.idModelo).subscribe({
              next: () => {
                this.cargarDatosMod();
                this.toastEliminar(modelo.nombreModelo);
              },
              error: (err) => this.toastError(err.error.error),
            });
          } else {
            this.modeloService
              .updateModelo(modelo.idModelo, resultado)
              .subscribe({
                next: () => {
                  this.cargarDatosMod();
                  this.cargarNombres();
                  this.toastEdit(modelo.nombreModelo);
                },
                error: (err) => this.toastError(err.error.error),
              });
          }
        }
      });
    });
  }

  // Modal para agregar un nuevo artículo
  abrirModalNuevoArticulo(respaldo?: any) {
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
              'Clasificación de articulo',
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
                  { valor: 'PERDIDO', texto: 'Perdido' },
                  { valor: 'ROBADO', texto: 'Robado' },
                  { valor: 'DANADO' , texto: 'Dañado' },
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
                  { valor: 'NO_DISPONIBLE', texto: 'No Disponible' },
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
            respaldo: respaldo,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result?.agregarCategoria) {
            this.abrirModalCrearCategoria(result.respaldo, 'articulo2');
            return;
          }
          if (result?.agregarMarca) {
            this.abrirModalCrearMarca(result.respaldo, 'articulo2');
            return;
          }
          if (result?.agregarModelo) {
            this.abrirModalCrearModelo(result.respaldo, 'articulo2');
            return;
          }
          if (result) {
            this.articuloService.createArticulo(result).subscribe({
              next: () => {
                this.cargarDatosArti();
                this.toastComplete(result.nombreArticulo);
              },
              error: (err) => this.toastError(err.error.error),
            });
          }
        });
      },
      error: (err) => this.toastError(err.error.error),
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
          pasos: [
            'Información básica',
            'Estado y disponibilidad',
            'Clasificación de articulo',
          ],
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
              paso: 1,
              opciones: [
                { valor: 'FUNCIONAL', texto: 'Funcional' },
                  { valor: 'MANTENIMIENTO', texto: 'Mantenimiento' },
                  { valor: 'DEFECTUOSO', texto: 'Defectuoso' },
                  { valor: 'PERDIDO', texto: 'Perdido' },
                  { valor: 'ROBADO', texto: 'Robado' },
                  { valor: 'DANADO' , texto: 'Dañado' },
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
                { valor: 'NO_DISPONIBLE', texto: 'No Disponible' },
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
              opciones: [],
            },

            {
              tipo: 'select',
              nombre: 'Modelo_idModelo',
              etiqueta: 'Modelo',
              obligatorio: true,
              paso: 2,
              opciones: [],
            },
          ],
          marcas,
          modelos,
          valoresIniciales: articulo,
        },
      });

      dialogRef.afterClosed().subscribe((resultado) => {
        if (resultado?.agregarCategoria) {
          this.abrirModalCrearCategoria(articulo, 'articulo');
          return;
        }

        if (resultado?.agregarModelo) {
          this.abrirModalCrearModelo(articulo, 'articulo');
          return;
        }

        if (resultado?.agregarMarca) {
          this.abrirModalCrearModelo(articulo, 'articulo');
          return;
        }

        if (resultado) {
          if (resultado.eliminar) {
            this.articuloService.deleteArticulo(articulo.idArticulo).subscribe({
              next: () => {
                this.cargarDatosArti();
                this.toastEliminar(articulo.nombreArticulo);
              },
              error: (err) => this.toastError(err.error.error),
            });
          } else {
            this.articuloService
              .updateArticulo(articulo.idArticulo, resultado)
              .subscribe({
                next: () => {
                  this.cargarDatosArti();
                  this.toastEdit(articulo.nombreArticulo);
                },
                error: (err) => this.toastError(err.error.error),
              });
          }
        }
      });
    });
  }

  abrirModalCrearCategoria(
    respaldo: any,
    origen: 'articulo' | 'marca' | 'modelo' | 'articulo2' | 'marca2' | 'modelo2' | 'modelo3' | 'marca3' | 'modelo4' | 'marca4'
  ) {
    const dialogRef = this.dialog.open(ModalAddComponent, {
      width: '400px',
      data: {
        titulo: 'Crear Nueva Categoría',
        pasos: ['Información básica'],
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
            nombre: 'descripCategoria',
            etiqueta: 'Descripción',
            obligatorio: false,
            paso: 0,
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.categoriaService.addCategoria(resultado).subscribe({
          next: () => {
            this.cargarDatosCat();
            this.cargarNombres();
            this.redirigirSegunOrigen(respaldo, origen);
            this.toastComplete(resultado.nombreCategoria);
          },
          error: (err) => this.toastError(err.error.error),
        });
      } else {
        this.redirigirSegunOrigen(respaldo, origen);
      }
    });
  }

  abrirModalCrearModelo(
    respaldo: any,
    origen: 'articulo' | 'marca' | 'modelo' | 'articulo2' | 'marca2' | 'modelo2' | 'modelo3' | 'marca3' | 'modelo4' | 'marca4'
  ) {
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
          if (result?.agregarCategoria) {
            if (origen === 'articulo') {
              this.abrirModalCrearCategoria(respaldo, 'modelo3');
              return;
            } else if (origen === 'articulo2') {
              this.abrirModalCrearCategoria(respaldo, 'modelo4');
              return;
            }
          }
          if (result) {
            this.modeloService.createModelo(result).subscribe({
              next: () => {
                this.cargarDatosMod();
                this.cargarNombres();
                this.toastComplete(result.nombreModelo);
                this.redirigirSegunOrigen(respaldo, origen);
              },
              error: (err) => this.toastError(err.error.error),
            });
          } else {
            this.redirigirSegunOrigen(respaldo, origen);
          }
        });
      },
      error: (err) => this.toastError(err.error.error),
    });
  }

  abrirModalCrearMarca(
    respaldo: any,
    origen: 'articulo' | 'marca' | 'modelo' | 'articulo2' | 'marca2' | 'modelo2' | 'modelo3' | 'marca3' | 'modelo4' | 'marca4'
  ) {
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
          if (result?.agregarCategoria) {
            if (origen === 'articulo') {
              this.abrirModalCrearCategoria(respaldo, 'marca3');
              return;
            } else if (origen === 'articulo2') {
              this.abrirModalCrearCategoria(respaldo, 'marca4');
              return;
            }
          }
          if (result) {
            this.marcasService.createMarca(result).subscribe({
              next: () => {
                this.cargarDatosMar();
                this.cargarNombres();
                this.toastComplete(result.nombreMarca);
                this.redirigirSegunOrigen(respaldo, origen);
              },
              error: (err) => this.toastError(err.error.error),
            });
          } else {
            this.redirigirSegunOrigen(respaldo, origen);
          }
        });
      },
      error: (err) => this.toastError(err.error.error),
    });
  }

  private redirigirSegunOrigen(
    respaldo: any,
    origen: 'articulo' | 'marca' | 'modelo' | 'articulo2' | 'marca2' | 'modelo2' | 'modelo3' | 'marca3' | 'modelo4' | 'marca4'
  ) {
    if (origen === 'articulo') {
      this.abrirModalEditarArticulo(respaldo);
    } else if (origen === 'marca') {
      this.abrirModalEditarMarca(respaldo);
    } else if (origen === 'modelo') {
      this.abrirModalEditarModelo(respaldo);
    } else if (origen === 'articulo2') {
      this.abrirModalNuevoArticulo(respaldo);
    } else if (origen === 'marca2') {
      this.abrirModalNuevaMarca(respaldo);
    } else if (origen === 'modelo2') {
      this.abrirModalNuevaModelo(respaldo);
    } else if (origen === 'modelo3') {
      this.abrirModalCrearModelo(respaldo , 'articulo');
    } else if (origen === 'modelo4') {
      this.abrirModalCrearModelo(respaldo , 'articulo2');
    } else if (origen === 'marca3') {
      this.abrirModalCrearMarca(respaldo , 'articulo');
    } else if (origen === 'marca4') {
      this.abrirModalCrearMarca(respaldo , 'articulo2');
    }
  }

  BuscarPIdCat(idCat: string): Observable<string> {
    return this.categoriaService
      .obtenerPorId(idCat)
      .pipe(map((c) => c.nombreCategoria));
  }
}
