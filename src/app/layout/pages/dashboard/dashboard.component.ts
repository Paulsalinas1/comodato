import { Component, inject, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { ComodatoService } from '../../../core/services/comodato.service';
import { PersonaService } from '../../../core/services/persona.service';
import { ArticulosService } from '../../../core/services/articulos.service';
import { Articulo } from '../../../core/models/articulo';
import { CategoriaService } from '../../../core/services/categoria.service';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Comodato } from '../../../core/models/Comodato';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';


interface CatosChars {
  nombre: string ,
  cantidad: number 
}

interface ChartDefinition {
  title: string;
  description?: string;
  type: ChartType;
  data: (string | number)[][];
  columns: string[];
  options: object; 
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //inyectando datos
  private readonly svComo = inject(ComodatoService);
  private readonly svUsu = inject(PersonaService);
  private readonly svArt = inject(ArticulosService);
  private readonly svCat = inject(CategoriaService);
  private readonly router = inject(Router);

  //datos
  activos: number = 0;
  usuarioTotal: number = 0;
  articulosTotales: number = 0;
  articulosDispo: number = 0;

  // datos pieChar
  entregados: number = 0;
  pendiente: number = 0;
  cancelado: number = 0;
  devuelto: number = 0;

  today = new Date();
  barChart!: ChartDefinition;
  pieChart2D!: ChartDefinition;

  // Gráfico de barras
  datosBarChar: CatosChars[] = [];

  //paginacion
  pageSizeOptions = [1, 5, 10, 25];

  // Configuración de paginación para comodato_usuario
  comodatoFPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  };

  como_fin_cerca: Comodato[] = [];
  como_fin_cercaPaginados: Comodato[] = [];
  personasPorId: { [id: string]: any } = {};
  filtroComo_Fin_C: string = '';

  ngOnInit() {
    this.svComo.getComodatos().subscribe((comoD) => {
      const entregados = comoD.filter((c) => c.estadoComodato === 'entregado');
      const pendiente = comoD.filter((c) => c.estadoComodato === 'pendiente');
      const cancelado = comoD.filter((c) => c.estadoComodato === 'cancelado');
      const devuelto = comoD.filter((c) => c.estadoComodato === 'devuelto');
      this.entregados = entregados.length;
      this.pendiente = pendiente.length;
      this.cancelado = cancelado.length;
      this.devuelto = devuelto.length;
      this.activos = entregados.length;
      // Gráfico de pastel 2D
      this.pieChart2D = {
        title: 'Comodatos Por Estado',
        description: 'muestra los diferentes estados de comodatos',
        type: ChartType.PieChart,
        data: [
          ['Entregado', this.entregados],
          ['Pendiente', this.pendiente],
          ['Cancelado', this.cancelado],
          ['Devuelto', this.devuelto],
        ],
        columns: ['Estado', 'Cantidad'],
        options: { legend: { position: 'bottom' } },
      };
    });
    this.svUsu.getPersonas().subscribe((p) => {
      const totalp = p.length;
      this.usuarioTotal = totalp;
    });
    this.svArt.getArticulos().subscribe((art) => {
      const artdisp = art.filter((a) => a.dispArticulo === 'DISPONIBLE');
      this.generarDatosPorTipo(art).subscribe((datosAgrupados) => {
        this.datosBarChar = datosAgrupados;
        // Gráfico de barras

        this.barChart = {
          title: 'Categoria por Articulo',
          description: 'Se muestran la cantidad de articulos por categoria',
          type: ChartType.BarChart,
          data: this.datosBarChar.map((dato) => [dato.nombre, dato.cantidad]),
          columns: ['Categoria', 'Cantidad'],
          options: { colors: ['#4285F4'], legend: { position: 'bottom' } },
        };
      });
      const cantart = art.length;
      const artdistotal = artdisp.length;
      this.articulosTotales = cantart;
      this.articulosDispo = artdistotal;
    });
    this.getComodatosFinCerca();
    this.svUsu.getPersonas().subscribe((personas) => {
      this.usuarioTotal = personas.length;
      // Diccionario para acceso rápido por id
      this.personasPorId = {};
      personas.forEach((p) => {
        this.personasPorId[p.idPersona] = p;
      });
    });
    

  }

  get totalEstados(): number {
    return this.entregados + this.pendiente + this.cancelado + this.devuelto;
  }

  generarDatosPorTipo(
    articulos: Articulo[]
  ): Observable<{ nombre: string; cantidad: number }[]> {
    if (articulos.length === 0) {
      return of([]);
    }

    const peticiones = articulos.map((art) =>
      this.svCat
        .obtenerPorId(art.Categoria_idCategoria)
        .pipe(map((cat) => cat?.nombreCategoria || 'Sin categoría'))
    );

    return forkJoin(peticiones).pipe(
      map((categorias) => {
        const conteo: { [nombre: string]: number } = {};

        categorias.forEach((nombre) => {
          conteo[nombre] = (conteo[nombre] || 0) + 1;
        });

        return Object.entries(conteo).map(([nombre, cantidad]) => ({
          nombre,
          cantidad,
        }));
      })
    );
  }

  getComodatosFinCerca() {
    //fecha actual
    const fechaActual = new Date();
    //obtener comodatos que terminen en los proximos 10 dias y no estén devueltos ni cancelados
    this.svComo.getComodatos().subscribe((comodatos) => {
      const proximosComodatos = comodatos.filter((comodato) => {
        const fechaFin = new Date(comodato.fechaTerminoComodatoD);
        const diferenciaDias = Math.ceil(
          (fechaFin.getTime() - fechaActual.getTime()) / (1000 * 3600 * 24)
        );
        // Excluir devueltos y cancelados
        return (
          diferenciaDias >= 0 &&
          diferenciaDias <= 10 &&
          comodato.estadoComodato !== 'devuelto' &&
          comodato.estadoComodato !== 'cancelado'
        );
      });
      this.como_fin_cerca = proximosComodatos;
    });
  }

  getDiasRestantes(fechaTermino: string | Date): number {
    const hoy = new Date();
    const fin = new Date(fechaTermino);
    // Limpiar horas para evitar desfases
    hoy.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    const diff = fin.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  get Comodato_Fin_Filtrados(): Comodato[] {
    const texto = this.filtroComo_Fin_C.trim().toLowerCase();
    if (!texto) return this.como_fin_cerca;

    return this.como_fin_cerca.filter((como_f) =>
      Object.values(como_f).some((val) =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get Comodato_F_Paginados(): Comodato[] {
    this.comodatoFPaginator.length = this.Comodato_Fin_Filtrados.length;
    const startIndex =
      this.comodatoFPaginator.pageIndex * this.comodatoFPaginator.pageSize;
    return this.Comodato_Fin_Filtrados.slice(
      startIndex,
      startIndex + this.comodatoFPaginator.pageSize
    );
  }

  onPageChangeComo_Fin(event: PageEvent): void {
    this.comodatoFPaginator.pageIndex = event.pageIndex;
    this.comodatoFPaginator.pageSize = event.pageSize;

    // Opcional: scroll al inicio de la tabla
    setTimeout(() => {
      document
        .getElementById('tabla-Como_Fin')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  }

  irAComodatosActivos() {
    this.router.navigate(['/comodatos'], {
      queryParams: { estado: 'entregado' }
    });
  }
  irAComodatosfinal(nombre: string) {
    this.router.navigate(['/comodatos'], {
      queryParams: { persona: nombre }
    });
  }
  irAUsuarios(){
    this.router.navigate(['/usuarios']);
  }
  irAArticulos(){
    this.router.navigate(['/articulos']);
  }
  irAArticulosDisponibles(){
    this.router.navigate(['/articulos'], {
      queryParams: { disp: 'DISPONIBLE' }
    });
  }

  onPieChartSelect(event: any) {
  const selectedRow = event?.selection?.[0]?.row;
  if (selectedRow !== undefined) {
    const estadoSeleccionado = this.pieChart2D.data[selectedRow][0]; // 
    this.router.navigate(['/comodatos'], {
      queryParams: { estado: estadoSeleccionado.toString().toLowerCase() }
    });
  }
}
onBarChartSelect(event: any) {
  const selectedRow = event?.selection?.[0]?.row;
  if (selectedRow !== undefined) {
    const categoriaSeleccionada = this.barChart.data[selectedRow][0]; 
    this.router.navigate(['/articulos'], {
      queryParams: { categoria: categoriaSeleccionada.toString().toLowerCase() }
    });
  }
}

}
