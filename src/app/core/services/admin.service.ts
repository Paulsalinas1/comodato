import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = '/api/admin';

  constructor(private http: HttpClient) {}

  crearAdmin(admin: any) {
    return this.http.post(`${this.apiUrl}`, admin);
  }

  obtenerAdmins() {
    return this.http.get(`${this.apiUrl}`);
  }

  obtenerAdmin(idAdmin: string) {
    return this.http.get(`${this.apiUrl}/${idAdmin}`);
  }

  actualizarAdmin(idAdmin: string, admin: any) {
    return this.http.put(`${this.apiUrl}/${idAdmin}`, admin);
  }

  eliminarAdmin(idAdmin: string) {
    return this.http.delete(`${this.apiUrl}/${idAdmin}`);
  }

  login(nombreAdmin: string, passAdmin: string) {
    return this.http.post('/api/login', { nombreAdmin, passAdmin });
  }
}