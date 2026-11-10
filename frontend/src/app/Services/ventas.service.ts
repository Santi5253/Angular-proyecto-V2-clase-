import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class VentasService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api/v1';

  obtenerTodas() { return this.http.get<any[]>(`${this.base}/ventas`); }
  obtenerHoy() { return this.http.get<any[]>(`${this.base}/ventas/hoy`); }
  registrar(venta: any) { return this.http.post<any>(`${this.base}/ventas`, venta); }
  resumenSemanal() { return this.http.get<any[]>(`${this.base}/ventas/resumen/semanal`); }
  resumenMensual() { return this.http.get<any[]>(`${this.base}/ventas/resumen/mensual`); }
}
