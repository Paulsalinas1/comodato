import { Component, inject, OnInit } from '@angular/core';
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
import { ModalComodatoComponent } from '../../components/modal-comodato/modal-comodato.component';
import Swal from 'sweetalert2';
import { DevolucionComodato } from '../../../core/models/Devolucion';
import { DevolucionComodatoService } from '../../../core/services/devolucion_comodato.service';
import { EstamentoService } from '../../../core/services/estamento.service';
import { ModalDes2Component } from '../../components/modal-des2/modal-des2.component';
import { ModalDes3Component } from '../../components/modal-des3/modal-des3.component';

@Component({
  selector: 'app-comodatos',
  standalone: false,
  templateUrl: './comodatos.component.html',
  styleUrl: './comodatos.component.css',
})
export class ComodatosComponent implements OnInit {
  private readonly svComodato = inject(ComodatoService);
  private readonly svArticulo_Comodato = inject(ArticuloComodatoService);
  private readonly svPersona = inject(PersonaService);
  private readonly svArticulo = inject(ArticulosService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly svDevolucionComodato = inject(DevolucionComodatoService);
  private readonly svEstamento = inject(EstamentoService);
  private readonly svDevueltos = inject(DevolucionComodatoService);
  // Configuración de paginación para comodato
  pageSizeOptions = [1, 5, 10, 25];
  comodatoPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  comodatoDevoludor = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  // Datos
  comodatos: Comodato[] = [];
  nombresResponsables: { [IdPersona: string]: string } = {};
  rutResponsables: { [IdPersona: string]: string } = {};
  nombresArticulos: { [comodatoId: string]: string[] } = {};
  comodatosTotales: number = 0;
  como_can: number = 0;
  como_dev: number = 0;
  como_emp: number = 0;

  devoluciones: DevolucionComodato[] = [];
  // Filtros
  filtroComodatos: string = '';
  filtroDevoluciones: string = '';

  ngOnInit(): void {
    this.cargarDatosComodatos();
  }

  CalcularTotalComodatos(): void {
    this.svComodato.getComodatos().subscribe((c) => {
      this.comodatosTotales = c.length;
      this.como_can = c.filter((c) => c.estadoComodato === 'cancelado').length;
      this.como_dev = c.filter((c) => c.estadoComodato === 'devuelto').length;
      this.como_emp = c.filter((c) => c.estadoComodato === 'entregado' || c.estadoComodato === 'pendiente').length;
    });
  }

  construirNombresArticulosAgrupados(): void {
    this.svComodato.getComodatos().subscribe((comodatos) => {
      const observables = comodatos.map((comodato: any) =>
        this.svArticulo_Comodato
          .obtenerArticulosPorComodato(comodato.idComodato)
          .pipe(
            map((articulos: Articulo[]) => ({
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

  construirResponsables(): void {
    this.svPersona.getPersonas().subscribe((per) => {
      this.nombresResponsables = Object.fromEntries(
        per.map((p) => [p.idPersona, p.nomPersona + ' ' + p.apPersona])
      );
      this.rutResponsables = Object.fromEntries(
        per.map((p) => [p.idPersona, p.rutPersona])
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
        this.construirResponsables();
        this.construirNombresArticulosAgrupados();
      },
      error: (err) => {
        console.error('Error al cargar los estamentos:', err);
      },
    });
    // Cargar devoluciones para poder usarlas en el modal de devolución
    this.svDevolucionComodato.getDevoluciones().subscribe({
      next: (data) => {
        // Aquí podrías procesar las devoluciones si es necesario
        this.devoluciones = data;
        this.actualizarLongitudDevolucion();
        console.log('Devoluciones cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar las devoluciones:', err);
      },
    });
    this.CalcularTotalComodatos();
  }

  private actualizarLongitudComodatos(): void {
    this.comodatoPaginator.length = this.comodatos.length;
  }

  private actualizarLongitudDevolucion(): void {
    this.comodatoDevoludor.length = this.devoluciones.length;
  }

  // Filtrado y paginación de comodatos
  get ComodatoFiltrados() {
    const texto = this.filtroComodatos.trim().toLowerCase();
    if (!texto)
      return this.comodatos.filter((c) => c.estadoComodato !== 'devuelto');

    return this.comodatos
      .filter((c) => c.estadoComodato !== 'devuelto')
      .filter((comodato) => {
        // Buscar en campos directos del comodato
        const enCampos = Object.values(comodato).some((val) =>
          String(val).toLowerCase().includes(texto)
        );
        // Buscar en nombre del responsable
        const nombreResponsable =
          this.nombresResponsables[comodato.Persona_idPersona] || '';
        const enNombre = nombreResponsable.toLowerCase().includes(texto);
        // Buscar en rut del responsable
        const rutResponsable =
          this.rutResponsables[comodato.Persona_idPersona] || '';
        const enRut = rutResponsable.toLowerCase().includes(texto);
        // Buscar en nombres de artículos asociados
        const articulos = this.nombresArticulos[comodato.idComodato!] || [];
        const enArticulos = articulos.some((nombre: string) =>
          nombre.toLowerCase().includes(texto)
        );

        return enCampos || enNombre || enRut || enArticulos;
      });
  }

  get devolucionFiltrados() {
    const texto = this.filtroDevoluciones.trim().toLowerCase();
    if (!texto) return this.devoluciones;

    return this.devoluciones.filter((dev) => {
      // Buscar en campos directos del comodato
      const enCampos = Object.values(dev).some((val) =>
        String(val).toLowerCase().includes(texto)
      );
      return enCampos;
    });
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

  get devolucionesPaginados(): DevolucionComodato[] {
    this.comodatoDevoludor.length = this.devolucionFiltrados.length;
    const startIndex =
      this.comodatoDevoludor.pageIndex * this.comodatoDevoludor.pageSize;
    return this.devolucionFiltrados.slice(
      startIndex,
      startIndex + this.comodatoDevoludor.pageSize
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

  onPageChangeDevoluciones(event: PageEvent): void {
    this.comodatoDevoludor.pageIndex = event.pageIndex;
    this.comodatoDevoludor.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-Devoluciones')
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
              {
                tipo: 'text',
                nombre: 'r_establecimiento',
                etiqueta: 'Nombre Responsable Establecimiento',
                obligatorio: true,
                paso: 0,
                valorInicial: respaldo ? respaldo.r_establecimiento : '',
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
              r_establecimiento: result.r_establecimiento,
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
                if (comodatoData.estadoComodato == 'entregado') {
                  const actualizaciones$ = articulos.map((idArticulo: string) =>
                    this.svArticulo.getArticulo(idArticulo).pipe(
                      switchMap((arti) => {
                        const arti2: Articulo = {
                          Categoria_idCategoria: arti.Categoria_idCategoria,
                          dispArticulo: 'EN_COMODATO',
                          estadoArticulo: arti.estadoArticulo,
                          desArticulo: arti.desArticulo,
                          Marca_idMarca: arti.Marca_idMarca,
                          Modelo_idModelo: arti.Modelo_idModelo,
                          nombreArticulo: arti.nombreArticulo,
                          numSerieArticulo: arti.numSerieArticulo,
                          idArticulo: arti.idArticulo,
                        };
                        return this.svArticulo.updateArticulo(
                          idArticulo,
                          arti2
                        );
                      })
                    )
                  );
                  forkJoin([...relaciones$, ...actualizaciones$]).subscribe({
                    next: () => {
                      this.toastComplete(
                        'Comodato y artículos asociados correctamente'
                      );
                      this.dialog.closeAll();
                      this.cargarDatosComodatos();
                      if (comodatoData.estadoComodato === 'entregado') {
                        this.confirmarDescarga(idComodato, comodatoData);
                      }
                    },
                    error: (err) => {
                      this.toastError(
                        'Error al asociar artículos o actualizar estado' + err
                      );
                      this.dialog.closeAll();
                      this.cargarDatosComodatos();
                    },
                  });
                } else if (comodatoData.estadoComodato == 'pendiente') {
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
                        return this.svArticulo.updateArticulo(
                          idArticulo,
                          arti2
                        );
                      })
                    )
                  );
                  forkJoin([...relaciones$, ...actualizaciones$]).subscribe({
                    next: () => {
                      this.toastComplete(
                        'Comodato y artículos asociados correctamente'
                      );
                      this.dialog.closeAll();
                      this.cargarDatosComodatos();
                    },
                    error: (err) => {
                      this.toastError(
                        'Error al asociar artículos o actualizar estado' + err
                      );
                      this.dialog.closeAll();
                      this.cargarDatosComodatos();
                    },
                  });
                }
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
        const dialogRef = this.dialog.open(ModalComodatoComponent, {
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
                tipo: 'text',
                nombre: 'r_establecimiento',
                etiqueta: 'Nombre Responsable Establecimiento',
                obligatorio: false,
                paso: 0,
                valorInicial: comodato.r_establecimiento,
                soloLectura: true, 
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
                tipo: 'selectEstado',
                nombre: 'estadoComodato',
                valorA: comodato.estadoComodato,
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
                soloLectura: [
                  'devuelto',
                  'cancelado',
                  'entregado',
                  'pendiente',
                ].includes(comodato.estadoComodato),
              },
            ],
            respaldo: comodato,
            valoresIniciales: {
              Persona_idPersona: comodato.Persona_idPersona,
              r_establecimiento: comodato.r_establecimiento,
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
            estadoComodato: result,
            Persona_idPersona: comodato.Persona_idPersona,
            r_establecimiento: comodato.r_establecimiento,
          };

          if (comodatoActualizado.estadoComodato === 'devuelto') {
            // Si el comodato fue devuelto, abrir modal de devolución
            this.abrirModalNuevaDevolucion(comodatoActualizado.idComodato!);
          } else {
            this.svComodato
              .updateComodato(comodato.idComodato!, comodatoActualizado)
              .subscribe({
                next: () => {
                  // Si el estado es "devuelto" o "cancelado", actualizar los artículos a DISPONIBLE
                  if (result === 'cancelado') {
                    const actualizaciones = articulos.map(
                      (idArticulo: Articulo) =>
                        this.svArticulo
                          .getArticulo(idArticulo.idArticulo!)
                          .pipe(
                            switchMap((arti) => {
                              const arti2: Articulo = {
                                Categoria_idCategoria:
                                  arti.Categoria_idCategoria,
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
                  } else if (result === 'entregado') {
                    const actualizaciones = articulos.map(
                      (idArticulo: Articulo) =>
                        this.svArticulo
                          .getArticulo(idArticulo.idArticulo!)
                          .pipe(
                            switchMap((arti) => {
                              const arti2: Articulo = {
                                Categoria_idCategoria:
                                  arti.Categoria_idCategoria,
                                dispArticulo: 'EN_COMODATO',
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
                  } else if (result === 'pendiente') {
                    const actualizaciones = articulos.map(
                      (idArticulo: Articulo) =>
                        this.svArticulo
                          .getArticulo(idArticulo.idArticulo!)
                          .pipe(
                            switchMap((arti) => {
                              const arti2: Articulo = {
                                Categoria_idCategoria:
                                  arti.Categoria_idCategoria,
                                dispArticulo: 'RESERVADO',
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
                  }
                },
                error: (err) => {
                  this.toastError(
                    'Error al actualizar el estado del comodato: ' + err.err
                  );
                },
              });
          }
        });
      },
      error: () => {
        this.toastError('Error al cargar datos para edición');
      },
    });
  }

  abrirModalNuevaDevolucion(comodatoId: string): void {
    forkJoin({
      comodato: this.svComodato.getComodatoById(comodatoId),
      articulos:
        this.svArticulo_Comodato.obtenerArticulosPorComodato(comodatoId),
      personas: this.svPersona.getPersonas(),
    }).subscribe({
      next: ({ comodato, articulos, personas }) => {
        const persona = personas.find(
          (p: any) => p.idPersona === comodato.Persona_idPersona
        );

        const camposArticulos = articulos
          .map((art: Articulo, index: number) => [
            {
              tipo: 'text',
              nombre: `nombre_articulo_${index + 1}`,
              etiqueta: `Artículo ${index + 1}`,
              valorInicial: art.nombreArticulo,
              soloLectura: true,
              paso: 1,
            },
            {
              tipo: 'select',
              nombre: `estado_a_${index + 1}`,
              etiqueta: `Estado Artículo ${index + 1}`,
              obligatorio: true,
              paso: 1,
              opciones: [
                { valor: 'FUNCIONAL', texto: 'Funcional' },
                { valor: 'DANADO', texto: 'Dañado' },
                { valor: 'PERDIDO', texto: 'Perdido' },
                { valor: 'ROBADO', texto: 'Robado' },
                { valor: 'DEFECTUOSO', texto: 'Defectuoso' },
              ],
            },
          ])
          .flat();
        const valoresIniciales = {
          nombre_completo_d: `${persona!.nomPersona} ${persona!.apPersona}`,
          rut_p_d: persona!.rutPersona,
          cargo_d: persona!.Estamento_idEstamento,
          r_establecimiento: comodato.r_establecimiento,
          ...Object.fromEntries(
            articulos.map((art, i) => [
              `nombre_articulo_${i + 1}`,
              art.nombreArticulo,
            ])
          ),
        };
        // Obtener cargo del responsable
        let cargo = '';
        this.svEstamento
          .getEstamentoById(persona!.Estamento_idEstamento)
          .subscribe((c) => {
            cargo = c.nombreEstamento;
          });

        const dialogRef = this.dialog.open(ModalDes2Component, {
          width: '1000px',
          data: {
            titulo: 'Registrar Devolución de Comodato',
            pasos: [
              'Datos del Responsable',
              'Estado de Artículos',
              'Confirmación',
            ],
            campos: [
              {
                tipo: 'text',
                nombre: 'nombre_completo_d',
                etiqueta: 'Nombre Responsable',
                valorInicial: `${persona!.nomPersona} ${persona!.apPersona}`,
                soloLectura: true,
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'rut_p_d',
                etiqueta: 'RUT',
                valorInicial: persona!.rutPersona,
                soloLectura: true,
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'r_establecimiento',
                etiqueta: 'Nombre Responsable Establecimiento',
                obligatorio: false,
                paso: 0,
                soloLectura: true, 
              },
              ...camposArticulos,
              {
                tipo: 'textarea',
                nombre: 'motivo_d',
                etiqueta: 'Motivo de Devolución',
                obligatorio: true,
                paso: 2,
              },
              {
                tipo: 'textarea',
                nombre: 'obsevacion_d',
                etiqueta: 'Observaciones generales',
                obligatorio: false,
                paso: 2,
              },
              {
                tipo: 'date',
                nombre: 'fecha_d',
                etiqueta: 'Fecha de Devolución',
                obligatorio: true,
                paso: 2,
              },
            ],
            valoresIniciales: valoresIniciales,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            // Preparar datos de devolución
            const devolucion: any = {
              nombre_completo_d: persona?.nomPersona + ' ' + persona?.apPersona,
              rut_p_d: persona?.rutPersona,
              cargo_d: cargo,
              motivo_d: result.motivo_d,
              obsevacion_d: result.obsevacion_d,
              fecha_d: result.fecha_d,
              r_establecimiento: comodato.r_establecimiento,
              Comodato_idComodato: comodatoId,
              ...Object.fromEntries(
                articulos.map((art, i) => [
                  `nombre_articulo_${i + 1}`,
                  art.nombreArticulo + ' --- ' + (art.numSerieArticulo ? ` ${art.numSerieArticulo}` : '') 
                  + ' --- ' + (art.desArticulo ? art.desArticulo : ''),
                ])
              ),
              ...Object.fromEntries(
                articulos.map((_, i) => [
                  `estado_a_${i + 1}`,
                  result[`estado_a_${i + 1}`],
                ])
              ),
            };

            this.svDevolucionComodato.createDevolucion(devolucion).subscribe({
              next: (resp) => {
                this.dialog.closeAll();

                const actualizaciones$ = articulos.map((art, i) => {
                  const nuevoEstado = result[`estado_a_${i + 1}`];

                  const actualizado: Articulo = {
                    ...art,
                    estadoArticulo: nuevoEstado,
                    dispArticulo:
                      nuevoEstado === 'FUNCIONAL'
                        ? 'DISPONIBLE'
                        : 'NO_DISPONIBLE',
                  };

                  return this.svArticulo.updateArticulo(
                    art.idArticulo,
                    actualizado
                  );
                });

                forkJoin(actualizaciones$).subscribe({
                  next: () => {
                    const comodatoActualizado: Comodato = {
                      ...comodato,
                      estadoComodato: 'devuelto',
                      fechaInicioComodato: this.formatearFecha(
                        new Date(comodato.fechaInicioComodato)
                      ),
                      fechaTerminoComodatoD: this.formatearFecha(
                        result.fecha_d
                      ),
                    };

                    this.svComodato
                      .updateComodato(comodatoId, comodatoActualizado)
                      .subscribe({
                        next: () => {
                          this.toastComplete(
                            'Devolución realizada correctamente'
                          );
                          this.cargarDatosComodatos();
                          this.confirmarDescarga(
                            resp.idDevolucion_comodato,
                            comodatoActualizado
                          );
                        },
                        error: (err) => {
                          this.toastError('Error: ' + err.err);
                        },
                      });
                  },
                  error: (err) => {
                    this.toastError('Error al actualizar artículos: ' + err);
                  },
                });
              },
              error: (err) => {
                this.toastError('Error al registrar devolución: ' + err);
              },
            });
          }
        });
      },
      error: () => {
        this.toastError('Error al cargar datos del comodato');
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

  descargarComprobante(idComodato: string): void {
    window.open(
      `http://10.9.1.28:3000/api/descargar/comprobante/${idComodato}`,
      '_blank' 
    );
  }

  descargarDevolucion(idDevolucion: string): void {
    window.open(
      `http://10.9.1.28:3000/api/descargar/devolucion/${idDevolucion}`,
      '_blank' 
    );
  }

  confirmarDescarga(id: string, comodato: Comodato): void {
    if (comodato.estadoComodato === 'entregado') {
      Swal.fire({
        title: '¿Deseas descargar el comprobante?',
        text: 'El comodato fue entregado correctamente.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, descargar',
        cancelButtonText: 'No, gracias',
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.descargarComprobante(id);
        }
      });
    } else {
      Swal.fire({
        title: '¿Deseas descargar el comprobante de devolución?',
        text: 'El comodato fue devuelto correctamente.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sí, descargar',
        cancelButtonText: 'No, gracias',
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.descargarDevolucion(id);
        }
      });
    }
  }

  abrirModalVerDevolucionComodato(devo: DevolucionComodato): void {
    forkJoin({
      personas: this.svPersona.getPersonas(),
      articulos: this.svArticulo.getArticulos(),
    }).subscribe({
      next: ({ personas, articulos }) => {
        const dialogRef = this.dialog.open(ModalDes3Component, {
          width: '1000px',
          data: {
            titulo: 'Ver Devolución de Comodato',
            soloLectura: true,
            pasos: [
              'Datos del Responsable',
              'Artículos Devueltos',
              'Motivo y Observación',
              'Recepción y Fecha',
            ],
            campos: [
              {
                tipo: 'text',
                nombre: 'nombre_completo_d',
                etiqueta: 'Nombre Completo',
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'rut_p_d',
                etiqueta: 'RUT',
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'cargo_d',
                etiqueta: 'Cargo',
                paso: 0,
              },
              {
                tipo: 'text',
                nombre: 'r_establecimiento',
                etiqueta: 'Nombre Responsable Establecimiento',
                paso: 0,
                valorInicial: devo.r_establecimiento,
                soloLectura: true, 
              },
              {
                tipo: 'list',
                nombre: 'articulosDevueltos',
                etiqueta: 'Artículos Devueltos',
                paso: 1,
              },
              {
                nombre: 'estadosArticulos',
              },
              {
                tipo: 'textarea',
                nombre: 'motivo_d',
                etiqueta: 'Motivo de Devolución',
                paso: 2,
                deshabilitado: true,
              },
              {
                tipo: 'textarea',
                nombre: 'observacion_d',
                etiqueta: 'Observación',
                paso: 2,
                deshabilitado: true,
              },
              {
                tipo: 'date',
                nombre: 'fecha_d',
                etiqueta: 'Fecha de Devolución',
                paso: 3,
              },
              {
                tipo: 'botonesDescargas',
                nombre: 'sin nombre',
                etiqueta: 'Opciones de los documentos',
                paso: 3,
              },
            ],
            valoresIniciales: {
              nombre_completo_d: devo.nombre_completo_d,
              rut_p_d: devo.rut_p_d,
              cargo_d: devo.cargo_d,
              articulosDevueltos: [
                devo.nombre_articulo_1,
                devo.nombre_articulo_2,
                devo.nombre_articulo_3,
                devo.nombre_articulo_4,
                devo.nombre_articulo_5,
                devo.nombre_articulo_6,
              ].filter(Boolean),
              estadosArticulos: [
                devo.estado_a_1,
                devo.estado_a_2,
                devo.estado_a_3,
                devo.estado_a_4,
                devo.estado_a_5,
                devo.estado_a_6,
              ].filter(Boolean),
              motivo_d: devo.motivo_d,
              observacion_d: devo.obsevacion_d,
              r_establecimiento: devo.r_establecimiento,
              fecha_d: this.formatearFecha(devo.fecha_d),
            },
          },
        });
        dialogRef.afterClosed().subscribe((resut) => {
          console.log(resut);
          if(resut === 'comodato'){
            this.descargarComprobante(devo.Comodato_idComodato);
            console.log('Descargando comprobante del comodato');
          }else if(resut === 'devolucion'){
            this.descargarDevolucion(devo.idDevolucion_comodato!);
            console.log('Se descargó el comprobante de devolución');
          }
        });
      },
      error: () => {
        this.toastError('Error al cargar datos para visualización');
      },
    });
  }
}
