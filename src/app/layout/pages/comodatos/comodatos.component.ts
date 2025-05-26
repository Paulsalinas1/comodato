import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-comodatos',
  standalone: false,
  templateUrl: './comodatos.component.html',
  styleUrl: './comodatos.component.css',

})
export class ComodatosComponent {
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
    {
      nombre: 'paul salinas',
      nom: '19.836.213-1',
      NumeroS: 'Computador ASUS, Mouse',
      Categoria: 'Entregado',
    },
    {
      nombre: 'vito vozano',
      nom: '20.142.456-1',
      NumeroS: 'Monitor Samsung, Teclado',
      Categoria: 'Entregado',
      
    },
    {
      nombre: 'mario gomez',
      nom: '15.236.253-k',
      NumeroS: 'Cable HDMI',
      Categoria: 'Devuelto',
      
    },
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
      this.usuariosFiltrados = this.usuarios.filter((u) =>
        Object.values(u).some((val) =>
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
