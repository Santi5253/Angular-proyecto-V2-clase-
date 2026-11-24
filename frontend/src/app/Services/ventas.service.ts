import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VentasService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  obtenerTodas() { return this.http.get<any[]>(`${this.base}/ventas`); }
  obtenerHoy() { return this.http.get<any[]>(`${this.base}/ventas/hoy`); }
  registrar(venta: any) { return this.http.post<any>(`${this.base}/ventas`, venta); }
  resumenSemanal() { return this.http.get<any[]>(`${this.base}/ventas/resumen/semanal`); }
  resumenMensual() { return this.http.get<any[]>(`${this.base}/ventas/resumen/mensual`); }
}
