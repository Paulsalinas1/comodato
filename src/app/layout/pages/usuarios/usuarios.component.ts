import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Estamento } from '../../../core/models/Estamento ';
import { Persona } from '../../../core/models/Persona ';
import { PersonaService } from '../../../core/services/persona.service';
import { EstamentoService } from '../../../core/services/estamento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ModalAddComponent } from '../../components/modal-add/modal-add.component';
import { ModalDesComponent } from '../../components/modal-des/modal-des.component';
import { forkJoin, map, Observable } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  // Fechas y paginación
  today = new Date();

  pageSizeOptions = [1, 5, 10, 25];

  // Configuración de paginación para categorías
  estamentosPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  // Datos
  estamentos: Estamento[] = [];
  personas: Persona[] = [];

  // Filtros
  filtroEstamentos: string = '';
  filtroPersonas: string = '';

  constructor(
    private readonly svcPersona: PersonaService,
    private readonly svcEstamento: EstamentoService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarDatosEst();
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

  cargarDatosEst(): void {
    this.svcEstamento.getEstamentos().subscribe({
      next: (data) => {
        this.estamentos = data;
        this.actualizarLongitudEstamentos();
      },
      error: (err) => {
        console.error('Error al cargar los estamentos:', err);
      },
    });
  }

  private actualizarLongitudEstamentos(): void {
    this.estamentosPaginator.length = this.estamentos.length;
  }

  // Filtrado y paginación de categorías
  get estamentosFiltrados(): Estamento[] {
    const texto = this.filtroEstamentos.trim().toLowerCase();
    if (!texto) return this.estamentos;

    return this.estamentos.filter((Estamento) =>
      Object.values(Estamento).some((val) =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get estamentosPaginados(): Estamento[] {
    this.estamentosPaginator.length = this.estamentosFiltrados.length;
    const startIndex =
      this.estamentosPaginator.pageIndex * this.estamentosPaginator.pageSize;
    return this.estamentosFiltrados.slice(
      startIndex,
      startIndex + this.estamentosPaginator.pageSize
    );
  }

  onPageChangeCategorias(event: PageEvent): void {
    this.estamentosPaginator.pageIndex = event.pageIndex;
    this.estamentosPaginator.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-Estamento')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  }

  abrirModalNuevaEstamento() {
    const dialogRef = this.dialog.open(ModalAddComponent, {
      width: '400px',
      data: {
        titulo: 'Crear Nueva Estamento',
        pasos: ['Informacion basica'],
        campos: [
          {
            tipo: 'text',
            nombre: 'nombreEstamento',
            etiqueta: 'Nombre',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'text',
            nombre: 'desEstamento',
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
        this.svcEstamento.createEstamento(result).subscribe({
          next: () => {
            this.cargarDatosEst();

            this.toastComplete(result.nombreEstamento);
          },
          error: (err) => {
            this.toastError(err.error.error);
          },
        });
      }
    });
  }

  //modal de editar y eliminar categorias
  abrirModalEditarEstamento(Estamento: Estamento) {
    const dialogRef = this.dialog.open(ModalDesComponent, {
      width: '600px',
      height: '',
      data: {
        titulo: 'Editar Estamento',
        pasos: ['Informacion basica'],
        campos: [
          {
            tipo: 'text',
            nombre: 'nombreEstamento',
            etiqueta: 'Nombre',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'textarea',
            nombre: 'desEstamento',
            etiqueta: 'Descripción',
            obligatorio: false,
            paso: 0,
          },
        ],
        valoresIniciales: Estamento,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        if (resultado.eliminar) {
          this.svcEstamento.deleteEstamento(Estamento.idEstamento).subscribe({
            next: () => {
              this.cargarDatosEst();
              this.toastEliminar(Estamento.nombreEstamento);
            },
            error: (err) => {
              this.toastError(err.error.error);
            },
          });
        } else {
          this.svcEstamento
            .updateEstamento(Estamento.idEstamento, resultado)
            .subscribe({
              next: () => {
                this.cargarDatosEst();
                this.toastComplete(Estamento.nombreEstamento);
              },
              error: (err) => {
                this.toastError(err.error.error);
              },
            });
        }
      }
    });
  }


}
