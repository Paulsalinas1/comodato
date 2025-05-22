import { Component } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  today = new Date();
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
    { nombre: 'John Michael',nom:'xxa' ,rut: '19.836.213-1', estamento: 'Docente', telefono: '912345678' },
    { nombre: 'Alexa Liras', nom:'xax' ,rut: '18.345.678-k', estamento: 'Directora', telefono: '901237561' },
    { nombre: 'Laurent Perrier', nom:'axx' ,rut: '21.345.345-1', estamento: 'Estudiante', telefono: '956371941' },
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
  
}
