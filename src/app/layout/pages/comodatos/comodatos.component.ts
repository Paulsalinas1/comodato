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
import { Articulo } from '../../../core/models/articulo';
import { map, switchMap } from 'rxjs/operators';

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
  nombresArticulos: { [comodatoId: string]: string[] } = {}; 
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

  construirNombresArticulosAgrupados(): void {
  this.svComodato.getComodatos().subscribe((comodatos) => {
    const observables = comodatos.map((comodato: any) =>
      this.svArticulo_Comodato.obtenerArticulosPorComodato(comodato.idComodato).pipe(
        map((articulos: any[]) => ({
          comodatoId: comodato.idComodato,
          nombres: articulos.map((art) => art.nombreArticulo),
        }))
      )
    );

    forkJoin(observables).subscribe((resultados) => {
      this.nombresArticulos = Object.fromEntries(
        resultados.map((res) => [res.comodatoId, res.nombres])
      );
    });
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
        const articulosDisponibles = articulos.filter(
          (articulo) =>
            articulo.dispArticulo == 'DISPONIBLE' &&
            articulo.estadoArticulo == 'FUNCIONAL'
        );
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
                opciones: articulosDisponibles.map((art: any) => ({
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
                const idComodato = resp.idComodato;
                const articulos: string[] = result.articulosSeleccionados ?? [];

                if (articulos.length === 0) {
                  this.toastError('Sin artículos');
                  this.cargarDatosComodatos();
                  return;
                }
                const relaciones$ = articulos.map((art) => {
                  const aso: RelacionArticuloComodato = {
                    Comodato_idComodato: idComodato,
                    Articulo_idArticulo: art,
                  };
                  return this.svArticulo_Comodato.crearRelacion(aso);
                });

                const actualizaciones$ = articulos.map((idArticulo: string) =>
                  this.svArticulo.getArticulo(idArticulo).pipe(
                    switchMap((arti) => {
                      const arti2: Articulo = {
                        Categoria_idCategoria: arti.Categoria_idCategoria,
                        dispArticulo: 'RESERVADO',
                        estadoArticulo: arti.estadoArticulo,
                        desArticulo: arti.desArticulo,
                        Marca_idMarca: arti.Marca_idMarca,
                        Modelo_idModelo: arti.Modelo_idModelo,
                        nombreArticulo: arti.nombreArticulo,
                        numSerieArticulo: arti.numSerieArticulo,
                        idArticulo: arti.idArticulo,
                      };
                      return this.svArticulo.updateArticulo(idArticulo, arti2);
                    })
                  )
                );

                forkJoin([...relaciones$, ...actualizaciones$]).subscribe({
                  next: () => {
                    this.toastComplete(
                      'Comodato y artículos asociados correctamente'
                    );
                    this.cargarDatosComodatos();
                  },
                  error: (err) => {
                    this.toastError(
                      'Error al asociar artículos o actualizar estado' + err
                    );
                    this.cargarDatosComodatos();
                  },
                });
              },
              error: () => {
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
      articulos: this.svArticulo_Comodato.obtenerArticulosPorComodato(
        comodato.idComodato!
      ),
    }).subscribe({
      next: ({ personas, articulos }) => {
        const dialogRef = this.dialog.open(ModalDesComponent, {
          width: '600px',
          data: {
            titulo: 'Editar Estado del Comodato',
            pasos: ['Datos del Comodato', 'Estado'],
            campos: [
              // Paso 0 - Solo mostrar datos, deshabilitados
              {
                tipo: 'select',
                nombre: 'Persona_idPersona',
                etiqueta: 'Persona Responsable',
                obligatorio: false,
                paso: 0,
                opciones: personas.map((per: any) => ({
                  valor: per.idPersona,
                  texto: `${per.nomPersona} ${per.apPersona}`,
                })),
                valorInicial: comodato.Persona_idPersona,
                soloLectura: true, // <-- deshabilitado
              },
              {
                tipo: 'multiselect',
                nombre: 'articulosSeleccionados',
                etiqueta: 'Artículos',
                obligatorio: false,
                paso: 0,
                opciones: articulos.map((art: any) => ({
                  valor: art.idArticulo,
                  texto: art.nombreArticulo,
                })),
                valorInicial: articulos.map(
                  (rel: any) => rel.Articulo_idArticulo
                ),
                soloLectura: true, // <-- deshabilitado
              },
              {
                tipo: 'date',
                nombre: 'fechaInicioComodato',
                etiqueta: 'Fecha de Inicio',
                obligatorio: false,
                paso: 0,
                valorInicial: this.formatearFecha(comodato.fechaInicioComodato),
                soloLectura: true, // <-- deshabilitado
              },
              {
                tipo: 'date',
                nombre: 'fechaTerminoComodato',
                etiqueta: 'Fecha de Término',
                obligatorio: false,
                paso: 0,
                valorInicial: this.formatearFecha(
                  comodato.fechaTerminoComodatoD
                ),
                soloLectura: true, // <-- deshabilitado
              },
              // Paso 1 - Solo editar estado
              {
                tipo: 'select',
                nombre: 'estadoComodato',
                etiqueta: 'Estado',
                obligatorio: true,
                paso: 1,
                opciones: [
                  { valor: 'pendiente', texto: 'Pendiente' },
                  { valor: 'entregado', texto: 'Entregado' },
                  { valor: 'devuelto', texto: 'Devuelto' },
                  { valor: 'cancelado', texto: 'Cancelado' },
                ],
                valorInicial: comodato.estadoComodato,
              },
            ],
            respaldo: comodato,
            valoresIniciales: {
              Persona_idPersona: comodato.Persona_idPersona,
              fechaInicioComodato: this.formatearFecha(
                comodato.fechaInicioComodato
              ),
              fechaTerminoComodato: this.formatearFecha(
                comodato.fechaTerminoComodatoD
              ),
              estadoComodato: comodato.estadoComodato,
              articulosSeleccionados: articulos.map(
                (rel: any) => rel.Articulo_idArticulo
              ),
            },
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (!result) return;
          const fechaInicioFormateada = new Date(comodato.fechaInicioComodato)
            .toISOString()
            .split('T')[0];
          const fechaTerminoFormateada = new Date(
            comodato.fechaTerminoComodatoD
          )
            .toISOString()
            .split('T')[0];
          const comodatoActualizado: Comodato = {
            idComodato: comodato.idComodato,
            fechaInicioComodato: fechaInicioFormateada,
            fechaTerminoComodatoD: fechaTerminoFormateada,
            estadoComodato: result.estadoComodato,
            Persona_idPersona: comodato.Persona_idPersona,
          };

          this.svComodato
            .updateComodato(comodato.idComodato!, comodatoActualizado)
            .subscribe({
              next: () => {
                // Si el estado es "devuelto" o "cancelado", actualizar los artículos a DISPONIBLE
                if (
                  result.estadoComodato === 'devuelto' ||
                  result.estadoComodato === 'cancelado'
                ) {
                  const actualizaciones = articulos.map(
                    (idArticulo: Articulo) =>
                      this.svArticulo.getArticulo(idArticulo.idArticulo!).pipe(
                        switchMap((arti) => {
                          const arti2: Articulo = {
                            Categoria_idCategoria: arti.Categoria_idCategoria,
                            dispArticulo: 'DISPONIBLE',
                            estadoArticulo: arti.estadoArticulo,
                            desArticulo: arti.desArticulo,
                            Marca_idMarca: arti.Marca_idMarca,
                            Modelo_idModelo: arti.Modelo_idModelo,
                            nombreArticulo: arti.nombreArticulo,
                            numSerieArticulo: arti.numSerieArticulo,
                            idArticulo: arti.idArticulo,
                          };
                          return this.svArticulo.updateArticulo(
                            idArticulo.idArticulo!,
                            arti2
                          );
                        })
                      )
                  );
                  forkJoin(actualizaciones).subscribe({
                    next: () => {
                      this.toastEdit(
                        'Estado del comodato y artículos actualizados'
                      );
                      this.cargarDatosComodatos();
                    },
                    error: () => {
                      this.toastError(
                        'Error al actualizar estado de los artículos'
                      );
                      this.cargarDatosComodatos();
                    },
                  });
                } else {
                  this.toastEdit('Estado del comodato');
                  this.cargarDatosComodatos();
                }
              },
              error: (err) => {
                this.toastError(
                  'Error al actualizar el estado del comodato: ' + err.err
                );
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
