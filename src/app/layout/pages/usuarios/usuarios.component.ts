import { Component } from '@angular/core';
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
import { ModalService } from '../../../core/services/modal.service';

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

  // datos de presentación
  u_totales: number = 0;
  est_total: number = 0;

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
  filtroEstamentoPersona: string = '';

  constructor(
    private readonly svcPersona: PersonaService,
    private readonly svcEstamento: EstamentoService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly modalService: ModalService

  ) {}

  ngOnInit(): void {
    this.cargarDatosEst();
    this.cargarDatosPer();
    this.cargarNombres();
    this.datos_presentacion();
  }

  datos_presentacion() {
    forkJoin({
      totalUsuarios: this.svcPersona
        .getPersonas()
        .pipe(map((data) => data.length)),
      totalEstamentos: this.svcEstamento
        .getEstamentos()
        .pipe(map((data) => data.length)),
    }).subscribe({
      next: ({ totalUsuarios, totalEstamentos }) => {
        this.u_totales = totalUsuarios;
        this.est_total = totalEstamentos;
      },
      error: (err) => {
        this.toastError('No se pudieron cargar los datos de presentación' + err);
      },
    });
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
      duration: 3000,
      panelClass: ['snackbar-exito'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  toastEdit(result: any) {
    this.snackBar.open(result + ' sea Editado !', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-exito'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
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
        this.datos_presentacion();
      },
      error: (err) => {
        this.toastError('No se pudieron cargar los estamentos' + err);
      },
    });
  }

  cargarDatosPer(): void {
    this.svcPersona.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
        this.actualizarLongitudPersonas();
        this.datos_presentacion();
      },
      error: (err) => {
        this.toastError('No se pudieron cargar las personas' + err);
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
    let lista = this.personas;

    // Filtrar por estamento si se seleccionó alguno
    if (this.filtroEstamentoPersona) {
      lista = lista.filter(
        (p) => p.Estamento_idEstamento === this.filtroEstamentoPersona
      );
    }

    if (!texto) return lista;

    return lista.filter((Persona) =>
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

    setTimeout(() => {
      document
        .getElementById('tabla-personas')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  }

  //modal de crear Estamentos
  abrirModalNuevaEstamento() {
    this.modalService.activarModal();
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
            this.modalService.desactivarModal();
            this.toastComplete(result.nombreEstamento);
          },
          error: (err) => {
            this.toastError(err.error.error);
            this.modalService.desactivarModal();
          },
        });
      }
      this.modalService.desactivarModal();
    });
  }

  //modal de editar y eliminar Estamentos
  abrirModalEditarEstamento(Estamento: Estamento) {
    this.modalService.activarModal();
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
              this.modalService.desactivarModal();
              this.toastEliminar(Estamento.nombreEstamento);
            },
            error: (err) => {
              this.modalService.desactivarModal();
              this.toastError(err.error.error);
            },
          });
        } else {
          this.svcEstamento
            .updateEstamento(Estamento.idEstamento, resultado)
            .subscribe({
              next: () => {
                this.cargarDatosEst();
                this.modalService.desactivarModal();
                this.toastComplete(Estamento.nombreEstamento);
              },
              error: (err) => {
                this.modalService.desactivarModal();
                this.toastError(err.error.error);
              },
            });
        }
      }
      this.modalService.desactivarModal();
    });
  }

  //modal de crear Persona
  abrirModalNuevaPersona(respaldo?: any): void {
    this.modalService.activarModal();
    this.svcEstamento.getEstamentos().subscribe({
      next: (estamentos) => {
        const dialogRef = this.dialog.open(ModalAddComponent, {
          width: '1000px',
          data: {
            titulo: 'Crear Nuevo Usuario',
            pasos: ['Información básica', 'Datos de Contacto', 'Complementos'],
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
                etiqueta: 'Apellidos',
                obligatorio: true,
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'rutPersona',
                etiqueta: 'RUT',
                obligatorio: true,
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'telefPersona',
                etiqueta: 'Teléfono',
                obligatorio: true,
                paso: 1,
              },
              {
                tipo: 'text',
                nombre: 'directPersona',
                etiqueta: 'Dirección',
                obligatorio: true,
                paso: 1,
              },
              {
                tipo: 'select',
                nombre: 'Estamento_idEstamento',
                etiqueta: 'Estamento',
                obligatorio: true,
                paso: 2,
                opciones: estamentos.map((est) => ({
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
            respaldo: respaldo,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result?.agregarEstamento) {
            this.abrirModalCrearEstamento(result.respaldo, 'Persona');
            return;
          }

          if (result) {
            this.svcPersona.createPersona(result).subscribe({
              next: () => {
                this.cargarDatosPer();
                this.cargarNombres();
                this.modalService.desactivarModal();
                this.toastComplete(result.nomPersona);
              },
              error: (err) => {
                this.modalService.desactivarModal();
                this.toastError(err.error?.error);
              },
            });
          }
          this.modalService.desactivarModal();
        });
      },
      error: (err) => {
        this.modalService.desactivarModal();
        this.toastError('No se pudieron cargar los estamentos');
      },
    });
  }

  //modal de editar y eliminar Persona
  abrirModalEditarPersona(persona: Persona) {
    this.modalService.activarModal();
    this.svcEstamento.getEstamentos().subscribe({
      next: (estamentos) => {
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
                tipo: 'select',
                nombre: 'Estamento_idEstamento',
                etiqueta: 'Estamento',
                obligatorio: true,
                paso: 2,
                opciones: estamentos.map((est) => ({
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
          if (resultado?.agregarEstamento) {
            this.abrirModalCrearEstamento(persona, 'Persona2');
            return;
          }
          
          if (resultado) {
            if (resultado.eliminar) {
              this.svcPersona.deletePersona(persona.idPersona).subscribe({
                next: () => {
                  this.cargarDatosPer();
                  this.modalService.desactivarModal();
                  this.toastEliminar(persona.nomPersona);
                },
                error: (err) => {
                  this.modalService.desactivarModal();
                  this.toastError(err.error.error);
                },
              });
            } else {
              this.svcPersona
                .updatePersona(persona.idPersona, resultado)
                .subscribe({
                  next: () => {
                    this.cargarDatosPer();
                    this.modalService.desactivarModal();
                    this.toastComplete(persona.nomPersona);
                  },
                  error: (err) => {
                    this.modalService.desactivarModal();
                    this.toastError(err.error.error);
                  },
                });
            }
          }
          this.modalService.desactivarModal();
        });
      },
      error: (err) => {
        this.modalService.desactivarModal();
        this.toastError('No se pudieron cargar los estamentos');
      },
    });
  }

  abrirModalCrearEstamento(respaldo: any, origen: 'Persona' | 'Persona2') {
    const dialogRef = this.dialog.open(ModalAddComponent, {
      width: '400px',
      data: {
        titulo: 'Crear Nuevo Estamento',
        pasos: ['Información básica'],
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

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.svcEstamento.createEstamento(resultado).subscribe({
          next: () => {
            this.cargarDatosEst();
            this.cargarNombres();
            this.redirigirSegunOrigen(respaldo, origen);
            this.toastComplete(resultado.nomEstemento);
          },
          error: (err) => this.toastError(err.error.error),
        });
      } else {
        this.redirigirSegunOrigen(respaldo, origen);
      }
    });
  }

  private redirigirSegunOrigen(respaldo: any, origen: 'Persona' | 'Persona2') {
    if (origen === 'Persona') {
      this.abrirModalNuevaPersona(respaldo);
    } else if (origen === 'Persona2') {
      this.abrirModalEditarPersona(respaldo);
    }
  }
}
