import { Component } from '@angular/core';
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

  // Configuración de paginación para estamento
  estamentosPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  personasPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  // Datos
  estamentos: Estamento[] = [];
  personas: Persona[] = [];
  estamentosMap: { [id: string]: string } = {};

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

    this.cargarNombres();
  }

  cargarNombres() {
    this.svcEstamento.getEstamentos().subscribe((ests) => {
      this.estamentosMap = Object.fromEntries(
        ests.map((e) => [e.idEstamento, e.nombreEstamento])
      );
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

  cargarDatosPer(): void {
    this.svcPersona.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
        this.actualizarLongitudPersonas();
      },
      error: (err) => {
        console.error('Error al cargar a los usuarios:', err);
      },
    });
  }

  private actualizarLongitudEstamentos(): void {
    this.estamentosPaginator.length = this.estamentos.length;
  }

  private actualizarLongitudPersonas(): void {
    this.personasPaginator.length = this.personas.length;
  }

  // Filtrado y paginación de Estamentos
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

  onPageChangeEstamentos(event: PageEvent): void {
    this.estamentosPaginator.pageIndex = event.pageIndex;
    this.estamentosPaginator.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-Estamento')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  }

  // Filtrado y paginación de Personas
  get personasFiltrados(): Persona[] {
    const texto = this.filtroPersonas.trim().toLowerCase();
    if (!texto) return this.personas;

    return this.personas.filter((Persona) =>
      Object.values(Persona).some((val) =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get PersonasPaginados(): Persona[] {
    this.personasPaginator.length = this.personasFiltrados.length;
    const startIndex =
      this.personasPaginator.pageIndex * this.personasPaginator.pageSize;
    return this.personasFiltrados.slice(
      startIndex,
      startIndex + this.personasPaginator.pageSize
    );
  }

  onPageChangePersonas(event: PageEvent): void {
    this.personasPaginator.pageIndex = event.pageIndex;
    this.personasPaginator.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-personas')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  }

  //modal de crear Estamentos
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

  //modal de editar y eliminar Estamentos
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

  //modal de crear Persona
  abrirModalNuevaPersona() {
    const dialogRef = this.dialog.open(ModalAddComponent, {
      width: '1000px',
      data: {
        titulo: 'Crear Nuevo Usuario',
        pasos: ['Informacion basica', 'Datos de Contacto', 'Complementos'],
        campos: [
          {
            tipo: 'text',
            nombre: 'nomPersona',
            etiqueta: 'Nombres',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'text',
            nombre: 'apPersona',
            etiqueta: 'apellidos',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'text',
            nombre: 'rutPersona',
            etiqueta: 'Rut',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'text',
            nombre: 'telefPersona',
            etiqueta: 'telefono',
            obligatorio: true,
            paso: 1,
          },
          {
            tipo: 'text',
            nombre: 'directPersona',
            etiqueta: 'Direccion',
            obligatorio: true,
            paso: 1,
          },
          {
            tipo: 'select',
            nombre: 'Estamento_idEstamento',
            etiqueta: 'Estamento',
            obligatorio: true,
            paso: 2,
            opciones: this.estamentos.map((est) => ({
              valor: est.idEstamento,
              texto: est.nombreEstamento,
            })),
          },
          {
            tipo: 'text',
            nombre: 'desPersona',
            etiqueta: 'Descripción',
            obligatorio: false,
            paso: 2,
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Aquí llamas al servicio para guardar la nueva categoría
        this.svcPersona.createPersona(result).subscribe({
          next: () => {
            this.cargarDatosPer();

            this.toastComplete(result.nombrePersona);
          },
          error: (err) => {
            this.toastError(err.error.error);
          },
        });
      }
    });
  }

  //modal de editar y eliminar Persona
  abrirModalEditarPersona(persona: Persona) {
    const dialogRef = this.dialog.open(ModalDesComponent, {
      width: '600px',
      height: '',
      data: {
        titulo: 'Editar usuario',
        pasos: ['Informacion basica', 'Datos de Contacto', 'Complementos'],
        campos: [
          {
            tipo: 'text',
            nombre: 'nomPersona',
            etiqueta: 'Nombres',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'text',
            nombre: 'apPersona',
            etiqueta: 'apellidos',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'text',
            nombre: 'rutPersona',
            etiqueta: 'Rut',
            obligatorio: true,
            paso: 0,
          },
          {
            tipo: 'text',
            nombre: 'telefPersona',
            etiqueta: 'telefono',
            obligatorio: true,
            paso: 1,
          },
          {
            tipo: 'text',
            nombre: 'directPersona',
            etiqueta: 'Direccion',
            obligatorio: true,
            paso: 1,
          },
          {
            tipo: 'text',
            nombre: 'Estamento_idEstamento',
            etiqueta: 'Estamento',
            obligatorio: true,
            paso: 2,
            opciones: this.estamentos.map((est) => ({
              valor: est.idEstamento,
              texto: est.nombreEstamento,
            })),
          },
          {
            tipo: 'text',
            nombre: 'desPersona',
            etiqueta: 'Descripción',
            obligatorio: false,
            paso: 2,
          },
        ],
        valoresIniciales: persona,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        if (resultado.eliminar) {
          this.svcPersona.deletePersona(persona.idPersona).subscribe({
            next: () => {
              this.cargarDatosPer();
              this.toastEliminar(persona.nomPersona);
            },
            error: (err) => {
              this.toastError(err.error.error);
            },
          });
        } else {
          this.svcEstamento
            .updateEstamento(persona.idPersona, resultado)
            .subscribe({
              next: () => {
                this.cargarDatosEst();
                this.toastComplete(persona.nomPersona);
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
