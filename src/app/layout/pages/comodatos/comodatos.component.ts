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

  // Configuración de paginación para comodato
  pageSizeOptions = [1, 5, 10, 25];
  comodatoPaginator = {
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
  // Filtros
  filtroComodatos: string = '';

  ngOnInit(): void {
    this.cargarDatosComodatos();

    this.CalcularTotalComodatos();
  }

  CalcularTotalComodatos(): void {
    this.svComodato.getComodatos().subscribe((c) => {
      this.comodatosTotales = c.length;
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
  }

  private actualizarLongitudComodatos(): void {
    this.comodatoPaginator.length = this.comodatos.length;
  }

  // Filtrado y paginación de comodatos
  get ComodatoFiltrados() {
    const texto = this.filtroComodatos.trim().toLowerCase();
    if (!texto) return this.comodatos;

    return this.comodatos.filter((comodato) => {
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
          };

          
            if (comodatoActualizado.estadoComodato === 'devuelto') {
            // Si el comodato fue devuelto, abrir modal de devolución
              this.abrirModalNuevaDevolucion(comodatoActualizado.idComodato!);
            }else {
              this.svComodato
            .updateComodato(comodato.idComodato!, comodatoActualizado)
            .subscribe({
              next: () => {
                // Si el estado es "devuelto" o "cancelado", actualizar los artículos a DISPONIBLE
                if (result === 'cancelado') {
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
                } else if (result === 'entregado') {
                  const actualizaciones = articulos.map(
                    (idArticulo: Articulo) =>
                      this.svArticulo.getArticulo(idArticulo.idArticulo!).pipe(
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
                      this.svArticulo.getArticulo(idArticulo.idArticulo!).pipe(
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
                { valor: 'DAÑADO', texto: 'Dañado' },
                { valor: 'PERDIDO', texto: 'Perdido' },
              ],
            },
          ])
          .flat();
        const valoresIniciales = {
          nombre_completo_d: `${persona!.nomPersona} ${persona!.apPersona}`,
          rut_p_d: persona!.rutPersona,
          cargo_d: persona!.Estamento_idEstamento,
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
                tipo: 'text',
                nombre: 'nombre_r_d',
                etiqueta: 'Responsable Recepción',
                obligatorio: true,
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
              nombre_r_d: result.nombre_r_d,
              fecha_d: result.fecha_d,
              Comodato_idComodato: comodatoId,
              ...Object.fromEntries(
                articulos.map((art, i) => [
                  `nombre_articulo_${i + 1}`,
                  art.nombreArticulo,
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
                this.toastComplete('Devolución registrada correctamente');
                this.dialog.closeAll();
                this.confirmarDescarga(resp.idDevolucion_comodato, comodato);
                this.cargarDatosComodatos();
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
      `http://10.9.1.28:3000/api/comprobante/descargar/${idComodato}`,
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
          this.descargarComprobante(id);
        }
      });
    }
  }
}
