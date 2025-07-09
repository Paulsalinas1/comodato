import { Component, inject, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { ComodatoService } from '../../../core/services/comodato.service';
import { PersonaService } from '../../../core/services/persona.service';
import { ArticulosService } from '../../../core/services/articulos.service';
import { Articulo } from '../../../core/models/articulo';
import { CategoriaService } from '../../../core/services/categoria.service';
import { forkJoin, map, Observable, of } from 'rxjs';

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
<<<<<<< HEAD
  // Gráfico de pastel 3D
  pieChart3D = {
    title: 'Comodatos Por Mes',
    description: 'descripcion',
    type: ChartType.PieChart,
    data: [
      ['Enero', 8],
      ['Febrero', 8],
      ['Marzo', 4],
      ['Abril', 2],
      ['Mayo', 5],
    ],
    options: { is3D: true, legend: { position: 'bottom' } },
  };
  // Gráfico de pastel 2D
  pieChart2D = {
    title: 'Comodatos Por Mes',
    description: 'descripcion',
    type: ChartType.PieChart,
    data: [
      ['Enero', 8],
      ['Febrero', 8],
      ['Marzo', 4],
      ['Abril', 2],
      ['Mayo', 5],
    ],
    columns: ['Mes', 'Cantidad'],
    options: { legend: { position:'bottom' }, Response:true },
  };
=======
  barChart!: ChartDefinition;
  pieChart2D!: ChartDefinition;
  // o tipo que estés usando
>>>>>>> 23f62a9a007d0ef41724594efaafe1849e7763a0

  datosBarChar: CatosChars[] = [];

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
}
