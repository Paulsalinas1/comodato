import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modelo } from '../models/Modelo';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  private apiUrl = 'http://10.9.2.33:3000/api/modelos'; // Cambia si usas otro puerto o dominio

  constructor(private http: HttpClient) { }

  getModelos(): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(this.apiUrl);
  }

  getModeloById(id: string): Observable<Modelo> {
    return this.http.get<Modelo>(`${this.apiUrl}/${id}`);
  }

  createModelo(modelo: Modelo): Observable<any> {
    return this.http.post(this.apiUrl, modelo);
  }

  updateModelo(id: string, modelo: Modelo): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, modelo);
  }

  deleteModelo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}