import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/Marca';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  /* private apiUrl = 'http://localhost:3000/api/marcas'; */
  private apiUrl = '/api/marcas';

  constructor(private http: HttpClient) {}

  // Obtener todas las marcas
  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  // Obtener una marca por ID
  getMarca(id: string): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva marca
  createMarca(marca: Marca): Observable<any> {
    return this.http.post(this.apiUrl, marca);
  }

  // Actualizar una marca
  updateMarca(id: string, marca: Marca): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, marca);
  }

  // Eliminar una marca
  deleteMarca(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
