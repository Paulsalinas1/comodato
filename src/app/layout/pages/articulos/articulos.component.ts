import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ChartType } from 'angular-google-charts';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria';

interface Articulo {
  id?: number;
  nombre: string;
  nom: string;
  numeroSerie: string;
  categoria: string;
  modelo: string;
}

@Component({
  selector: 'app-articulos',
  standalone: false,
  templateUrl: './articulos.component.html',
  styleUrl: './articulos.component.css'
})
export class ArticulosComponent {
  // Fechas y paginación
  today = new Date();

  pageSizeOptions = [1,5, 10, 25];

  // Configuración de paginación para artículos
  articulosPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0
  };

  // Configuración de paginación para categorías
  categoriasPaginator = {
    pageIndex: 0,
    pageSize: 5,
    length: 0
  };

  // Datos
  categorias: Categoria[] = [];
  articulos: Articulo[] = [
    { nombre: 'Computador lg', nom: 'Lg', numeroSerie: 'sqwr3', categoria: 'notebook', modelo: 'lg-240' },
    { nombre: 'Computador hp', nom: 'hp', numeroSerie: 'sqwr34', categoria: 'notebook', modelo: 'hp-360' },
    { nombre: 'Computador lenobo', nom: 'lenobo', numeroSerie: 'lnQW5', categoria: 'notebook', modelo: 'L-150' },
  ];

  // Filtros
  filtroArticulos: string = '';
  filtroCategorias: string = '';

  constructor(private categoriaService: CategoriaService) { }


  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.actualizarLongitudCategorias();
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  // Filtrado y paginación de artículos
  get articulosFiltrados(): Articulo[] {
    const texto = this.filtroArticulos.trim().toLowerCase();
    if (!texto) return this.articulos;
    
    return this.articulos.filter(articulo =>
      Object.values(articulo).some(val =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get articulosPaginados(): Articulo[] {
    this.articulosPaginator.length = this.articulosFiltrados.length;
    const startIndex = this.articulosPaginator.pageIndex * this.articulosPaginator.pageSize;
    return this.articulosFiltrados.slice(startIndex, startIndex + this.articulosPaginator.pageSize);
  }

  onPageChangeArticulos(event: PageEvent): void {
    this.articulosPaginator.pageIndex = event.pageIndex;
    this.articulosPaginator.pageSize = event.pageSize;
  }

  // Filtrado y paginación de categorías
  get categoriasFiltradas(): Categoria[] {
    const texto = this.filtroCategorias.trim().toLowerCase();
    if (!texto) return this.categorias;
    
    return this.categorias.filter(categoria =>
      Object.values(categoria).some(val =>
        String(val).toLowerCase().includes(texto)
      )
    );
  }

  get categoriasPaginadas(): Categoria[] {
    this.categoriasPaginator.length = this.categoriasFiltradas.length;
    const startIndex = this.categoriasPaginator.pageIndex * this.categoriasPaginator.pageSize;
    return this.categoriasFiltradas.slice(startIndex, startIndex + this.categoriasPaginator.pageSize);
  }

  onPageChangeCategorias(event: PageEvent): void {
    this.categoriasPaginator.pageIndex = event.pageIndex;
    this.categoriasPaginator.pageSize = event.pageSize;
  }

  private actualizarLongitudCategorias(): void {
    this.categoriasPaginator.length = this.categorias.length;
  }


}
