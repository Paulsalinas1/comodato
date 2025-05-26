import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-articulos',
  standalone: false,
  templateUrl: './articulos.component.html',
  styleUrl: './articulos.component.css'
})
export class ArticulosComponent {
  today = new Date();
  paginaActual = 0;
  tamanioPagina = 5;

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
        options: { legend: { position: 'bottom' }, responsive: true },
      };
  
    usuarios = [
      { nombre: 'Computador lg',nom:'Lg' ,NumeroS: 'sqwr3', Categoria: 'notebook', Modelo: 'lg-240' },
      { nombre: 'Computador hp', nom:'hp' ,NumeroS: 'sqwr34', Categoria: 'notebook', Modelo: 'hp-360' },
      { nombre: 'Computador lenobo', nom:'lenobo' ,NumeroS: 'lnQW5', Categoria: 'notebook', Modelo: 'L-150' },
      // agrega más usuarios si quieres
    ];
    filtro: string = '';
    usuariosFiltrados = [...this.usuarios]; // copia inicial
    pagina: number = 1;
  
    aplicarFiltro() {
      const texto = this.filtro.trim().toLowerCase();
  
      if (texto === '') {
        this.usuariosFiltrados = [...this.usuarios];
      } else {
        this.usuariosFiltrados = this.usuarios.filter(u =>
          Object.values(u).some(val =>
            String(val).toLowerCase().includes(texto)
          )
        );
      }
  
      this.pagina = 1; // reiniciar a la primera página
    }

  get usuariosPaginados() {
    const inicio = this.paginaActual * this.tamanioPagina;
    const fin = inicio + this.tamanioPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }

  onPageChange(event: PageEvent) {
    this.paginaActual = event.pageIndex;
    this.tamanioPagina = event.pageSize;
  }
}
