import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Estamento } from '../models/Estamento ';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstamentoService {
  private apiUrl = 'http://localhost:3000/api/estamentos';

  constructor(private http: HttpClient) {}

  getEstamentos(): Observable<Estamento[]> {
    return this.http.get<Estamento[]>(this.apiUrl);
  }

  getEstamentoById(id: string): Observable<Estamento> {
    return this.http.get<Estamento>(`${this.apiUrl}/${id}`);
  }

  createEstamento(estamento: Estamento): Observable<any> {
    return this.http.post(this.apiUrl, estamento);
  }

  updateEstamento(id: string, estamento: Estamento): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, estamento);
  }

  deleteEstamento(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
