import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelacionArticuloComodato } from '../models/RelacionArticuloComodato ';


@Injectable({
  providedIn: 'root'
})
export class ArticuloComodatoService {

  /* private readonly baseUrl = 'http://localhost:3000/api/articulo_has_comodato'; */ // Ajusta si tu ruta cambia
  private readonly baseUrl = '/api/articulo_has_comodato'; // Ajusta si tu ruta 2 en cado de querer la ip

  constructor(private readonly http: HttpClient) {}

  // Crear relación entre artículo y comodato
  crearRelacion(data: RelacionArticuloComodato): Observable<any> {
    console.log('aqui estoy 3')
    return this.http.post(`${this.baseUrl}`, data);
  }

  // Obtener todos los artículos asociados a un comodato
  obtenerArticulosPorComodato(comodatoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${comodatoId}`);
  }

  // Eliminar relación entre artículo y comodato
  eliminarRelacion(data: RelacionArticuloComodato): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}`, { body: data });
  }

eliminarRelacionesPorComodato(comodatoId: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/comodato/${comodatoId}`);
}
}
