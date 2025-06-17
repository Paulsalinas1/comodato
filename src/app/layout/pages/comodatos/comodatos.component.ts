import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Comodato } from '../../../core/models/Comodato';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComodatoService } from '../../../core/services/comodato.service';
import { forkJoin } from 'rxjs';
import { PersonaService } from '../../../core/services/persona.service';
import { ArticulosService } from '../../../core/services/articulos.service';
import { ArticuloComodatoService } from '../../../core/services/articulo_comodato.service';
import { RelacionArticuloComodato } from '../../../core/models/RelacionArticuloComodato ';
import { ModalAddComponent } from '../../components/modal-add/modal-add.component';
import { ModalDesComponent } from '../../components/modal-des/modal-des.component';


@Component({
  selector: 'app-comodatos',
  standalone: false,
  templateUrl: './comodatos.component.html',
  styleUrl: './comodatos.component.css',
})
export class ComodatosComponent implements OnInit {
  pageSizeOptions = [1, 5, 10, 25];

  // Configuración de paginación para estamento
  comodatoPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  // Datos
  comodatos: Comodato[] = [];
  relaciones: any[] = [];
  articulosMap: { [id: string]: string } = {};
  articulos2Map: { [comodatoId: string]: string[] } = {};
  nombresResponsables: { [IdPersona: string]: string } = {};
  rutResponsables: { [IdPersona: string]: string } = {};

  // Filtros
  filtroComodatos: string = '';

  constructor(
    private readonly svComodato: ComodatoService,
    private readonly svArticulo_Comodato: ArticuloComodatoService,
    private readonly svPersona: PersonaService,
    private readonly svArticulo: ArticulosService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarDatosComodatos();
    this.cargarNombresArticulos();
    this.construirNombresResponsables();
    this.construirRutResponsables();
  }

  construirArticulosMap(): void {
    this.articulos2Map = {};

    this.relaciones.forEach((rel) => {
      const comodatoId = rel.Comodato_idComodato;
      const nombreArticulo = rel.nombreArticulo;

      if (!this.articulos2Map[comodatoId]) {
        this.articulos2Map[comodatoId] = [];
      }
      this.articulos2Map[comodatoId].push(nombreArticulo);
    });
  }

  construirNombresResponsables(): void {
    this.svPersona.getPersonas().subscribe((per) => {
      this.nombresResponsables = Object.fromEntries(
        per.map((p) => [p.idPersona, p.nomPersona + ' ' + p.apPersona])
      );
    });
  }

  construirRutResponsables(): void {
    this.svPersona.getPersonas().subscribe((per) => {
      this.rutResponsables = Object.fromEntries(
        per.map((p) => [p.idPersona, p.rutPersona])
      );
    });
  }

  cargarNombresArticulos() {
    this.svArticulo.getArticulos().subscribe((art) => {
      this.articulosMap = Object.fromEntries(
        art.map((e) => [e.idArticulo, e.nombreArticulo])
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

  cargarDatosComodatos(): void {
    this.svComodato.getComodatos().subscribe({
      next: (data) => {
        this.comodatos = data;
        this.actualizarLongitudComodatos();
      },
      error: (err) => {
        console.error('Error al cargar los estamentos:', err);
      },
    });
  }

  private actualizarLongitudComodatos(): void {
    this.comodatoPaginator.length = this.comodatos.length;
  }

  // Filtrado y paginación de Estamentos
  get ComodatoFiltrados(): Comodato[] {
    const texto = this.filtroComodatos.trim().toLowerCase();
    if (!texto) return this.comodatos;

    return this.comodatos.filter((Comodato) =>
      Object.values(Comodato).some((val) =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get comodatosPaginados(): Comodato[] {
    this.comodatoPaginator.length = this.ComodatoFiltrados.length;
    const startIndex =
      this.comodatoPaginator.pageIndex * this.comodatoPaginator.pageSize;
    return this.ComodatoFiltrados.slice(
      startIndex,
      startIndex + this.comodatoPaginator.pageSize
    );
  }

  onPageChangeComodatos(event: PageEvent): void {
    this.comodatoPaginator.pageIndex = event.pageIndex;
    this.comodatoPaginator.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-Comodatos')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  }

  abrirModalNuevoComodatoCompleto(respaldo?: any): void {
    // Primero traes personas y artículos en paralelo
    forkJoin({
      personas: this.svPersona.getPersonas(),
      articulos: this.svArticulo.getArticulos(),
    }).subscribe({
      next: ({ personas, articulos }) => {
        const dialogRef = this.dialog.open(ModalAddComponent, {
          width: '1000px',
          data: {
            titulo: 'Crear Comodato Completo',
            pasos: [
              'Seleccionar Usuario',
              'Seleccionar Artículos',
              'Fechas y Estado',
            ],
            campos: [
              // Paso 0 - Personas (select o crear)
              {
                tipo: 'select',
                nombre: 'Persona_idPersona',
                etiqueta: 'Persona Responsable',
                obligatorio: true,
                paso: 0,
                opciones: personas.map((per: any) => ({
                  valor: per.idPersona,
                  texto: `${per.nomPersona} ${per.apPersona}`,
                })),
                permitirCrear: true, // si quieres botón para crear nueva persona desde modal
              },
              // Paso 1 - Selección múltiple de artículos (checkbox o multiselect)
              {
                tipo: 'multiselect',
                nombre: 'articulosSeleccionados',
                etiqueta: 'Artículos',
                obligatorio: true,
                paso: 1,
                opciones: articulos.map((art: any) => ({
                  valor: art.idArticulo,
                  texto: art.nombreArticulo, // ajusta según campo real
                })),
              },
              // Paso 2 - Fechas y estado
              {
                tipo: 'date',
                nombre: 'fechaInicioComodato',
                etiqueta: 'Fecha de Inicio',
                obligatorio: true,
                paso: 2,
              },
              {
                tipo: 'date',
                nombre: 'fechaTerminoComodato',
                etiqueta: 'Fecha de Término',
                obligatorio: true,
                paso: 2,
              },
              {
                tipo: 'select',
                nombre: 'estadoComodato',
                etiqueta: 'Estado',
                obligatorio: true,
                paso: 2,
                opciones: [
                  { valor: 'pendiente', texto: 'Pendiente' },
                  { valor: 'entregado', texto: 'Entregado' },
                  { valor: 'devuelto', texto: 'Devuelto' },
                  { valor: 'cancelado', texto: 'Cancelado' },
                ],
              },
            ],
            respaldo: respaldo,
            
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            // 1. Crear comodato
            const comodatoData = {
              fechaInicioComodato: result.fechaInicioComodato,
              fechaTerminoComodatoD: result.fechaTerminoComodato,
              estadoComodato: result.estadoComodato,
              Persona_idPersona: result.Persona_idPersona,
            };

            this.svComodato.createComodato(comodatoData).subscribe({
              next: (resp: any) => {
                const idComodato = resp.idComodato; // asumiendo que backend responde con el id

                // 2. Asociar artículos
                const articulos: string[] = result.articulosSeleccionados || [];
                const asociaciones = articulos.map((idArticulo) => ({
                  Comodato_idComodato: idComodato,
                  Articulo_idArticulo: idArticulo,
                }));

                // Llama a tu servicio que haga el POST para cada asociación
                // O usa forkJoin para hacer todas las peticiones simultáneas
                if (asociaciones.length === 0) {
                  this.toastComplete('Comodato creado sin artículos');
                  this.cargarDatosComodatos();
                  return;
                }

                const solicitudes = asociaciones.map((asoc) =>
                  this.svArticulo_Comodato.crearRelacion(asoc)
                );

                forkJoin(solicitudes).subscribe({
                  next: () => {
                    this.toastComplete(
                      'Comodato y artículos asociados correctamente'
                    );
                    this.cargarDatosComodatos();
                  },
                  error: (err) => {
                    this.toastError('Error al asociar artículos');
                    this.cargarDatosComodatos();
                  },
                });
              },
              error: (err) => {
                this.toastError('Error al crear comodato');
              },
            });
          }
        });
      },
      error: () => {
        this.toastError('Error al cargar personas o artículos');
      },
    });
  }

  abrirModalEditarComodatoCompleto(comodato: Comodato): void {
    forkJoin({
      personas: this.svPersona.getPersonas(),
      articulos: this.svArticulo.getArticulos(),
      relaciones: this.svArticulo_Comodato.obtenerArticulosPorComodato(
        comodato.idComodato!
      ),
    }).subscribe({
      next: ({ personas, articulos, relaciones }) => {
        const dialogRef = this.dialog.open(ModalDesComponent, {
          width: '1000px',
          data: {
            titulo: 'Editar Comodato',
            pasos: [
              'Seleccionar Usuario',
              'Seleccionar Artículos',
              'Fechas y Estado',
            ],
            campos: [
              // Paso 0 - Persona
              {
                tipo: 'select',
                nombre: 'Persona_idPersona',
                etiqueta: 'Persona Responsable',
                obligatorio: true,
                paso: 0,
                opciones: personas.map((per: any) => ({
                  valor: per.idPersona,
                  texto: `${per.nomPersona} ${per.apPersona}`,
                })),
                permitirCrear: true,
                
              },
              // Paso 1 - Artículos
              {
                tipo: 'multiselect',
                nombre: 'articulosSeleccionados',
                etiqueta: 'Artículos',
                obligatorio: true,
                paso: 1,
                opciones: articulos.map((art: any) => ({
                  valor: art.idArticulo,
                  texto: art.nombreArticulo,
                })),
                
              },
              // Paso 2 - Fechas y Estado
              {
                tipo: 'date',
                nombre: 'fechaInicioComodato',
                etiqueta: 'Fecha de Inicio',
                obligatorio: true,
                paso: 2,
                
              },
              {
                tipo: 'date',
                nombre: 'fechaTerminoComodato',
                etiqueta: 'Fecha de Término',
                obligatorio: true,
                paso: 2,
                
              },
              {
                tipo: 'select',
                nombre: 'estadoComodato',
                etiqueta: 'Estado',
                obligatorio: true,
                paso: 2,
                opciones: [
                  { valor: 'pendiente', texto: 'Pendiente' },
                  { valor: 'entregado', texto: 'Entregado' },
                  { valor: 'devuelto', texto: 'Devuelto' },
                  { valor: 'cancelado', texto: 'Cancelado' },
                ],
                valorInicial: comodato.estadoComodato,
              },
            ],
            respaldo: comodato, // importante para saber si es edición
            valoresIniciales: {
              Persona_idPersona: comodato.Persona_idPersona,
              fechaInicioComodato: this.formatearFecha(
                comodato.fechaInicioComodato
              ),
              fechaTerminoComodato: this.formatearFecha(
                comodato.fechaTerminoComodatoD
              ),
              estadoComodato: comodato.estadoComodato,
              articulosSeleccionados: relaciones.map(
                (rel: any) => rel.Articulo_idArticulo
              ),

            
          },
          },
        });
        

        dialogRef.afterClosed().subscribe((result) => {
          if (!result) return;

          // Eliminar comodato si vino la señal
          if (result.eliminar) {
            this.svComodato.deleteComodato(comodato.idComodato!).subscribe({
              next: () => {
                this.toastComplete('Comodato eliminado correctamente');
                this.cargarDatosComodatos();
              },
              error: () => {
                this.toastError('Error al eliminar comodato');
              },
            });
            return;
          }

          // Actualización
          const comodatoActualizado = {
            fechaInicioComodato: result.fechaInicioComodato,
            fechaTerminoComodatoD: result.fechaTerminoComodato,
            estadoComodato: result.estadoComodato,
            Persona_idPersona: result.Persona_idPersona,
          };

          this.svComodato
            .updateComodato(comodato.idComodato!, comodatoActualizado)
            .subscribe({
              next: () => {
                // Actualizar relaciones
                this.svArticulo_Comodato
                  .eliminarRelacionesPorComodato(comodato.idComodato!)
                  .subscribe({
                    next: () => {
                      const nuevasRelaciones = (
                        result.articulosSeleccionados || []
                      ).map((idArticulo: string) => ({
                        Comodato_idComodato: comodato.idComodato,
                        Articulo_idArticulo: idArticulo,
                      }));

                      const solicitudes = nuevasRelaciones.map(
                        (rel: RelacionArticuloComodato) =>
                          this.svArticulo_Comodato.crearRelacion(rel)
                      );

                      forkJoin(solicitudes).subscribe({
                        next: () => {
                          this.toastComplete(
                            'Comodato actualizado correctamente'
                          );
                          this.cargarDatosComodatos();
                        },
                        error: () => {
                          this.toastError('Error al asociar artículos');
                        },
                      });
                    },
                    error: () => {
                      this.toastError('Error al eliminar relaciones previas');
                    },
                  });
              },
              error: () => {
                this.toastError('Error al actualizar comodato');
              },
            });
        });
      },
      error: () => {
        this.toastError('Error al cargar datos para edición');
      },
    });
  }

  formatearFecha(fecha: string | Date): string {
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
