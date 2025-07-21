import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comodato } from '../models/Comodato';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComodatoService {
  private readonly apiUrl = '/api/comodatos';

  constructor(private readonly http: HttpClient) {}

  // Obtener todos los comodatos
  getComodatos(): Observable<Comodato[]> {
    return this.http.get<Comodato[]>(this.apiUrl);
  }

  // Obtener un comodato por ID
  getComodatoById(id: string): Observable<Comodato> {
    return this.http.get<Comodato>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo comodato
  createComodato(comodato: Comodato): Observable<{ message: string; idComodato: string }> {
    return this.http.post<{ message: string; idComodato: string }>(this.apiUrl, comodato);
  }

  // Actualizar comodato
  updateComodato(id: string, comodato: Comodato): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, comodato);
  }

  // Eliminar comodato
  deleteComodato(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
