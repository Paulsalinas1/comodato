import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DevolucionComodato } from '../models/Devolucion'; 
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DevolucionComodatoService {
  private readonly apiUrl = '/api/devoluciones';

  constructor(private readonly http: HttpClient) {}

  getDevoluciones(): Observable<DevolucionComodato[]> {
    return this.http.get<DevolucionComodato[]>(this.apiUrl);
  }

  getDevolucionById(id: string): Observable<DevolucionComodato> {
    return this.http.get<DevolucionComodato>(`${this.apiUrl}/${id}`);
  }

  createDevolucion(devolucion: DevolucionComodato): Observable<{ message: string; idDevolucion_comodato: string }> {
    return this.http.post<{ message: string; idDevolucion_comodato: string }>(this.apiUrl, devolucion);
  }

  updateDevolucion(id: string, devolucion: DevolucionComodato): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, devolucion);
  }

  deleteDevolucion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}