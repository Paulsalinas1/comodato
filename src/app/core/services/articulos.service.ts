import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Articulo } from '../models/articulo';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {
  private apiUrl = 'http://localhost:3000/api/articulos'; // Cambia si tienes otro puerto o ruta base

  constructor(private http: HttpClient) {}

  getArticulos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(this.apiUrl);
  }

  getArticulo(id: string): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.apiUrl}/${id}`);
  }

  createArticulo(articulo: Articulo): Observable<{ message: string; idArticulo: string }> {
    return this.http.post<{ message: string; idArticulo: string }>(this.apiUrl, articulo);
  }

  updateArticulo(id: string, articulo: Articulo): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, articulo);
  }

  deleteArticulo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
