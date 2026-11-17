import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api/v1';
  obtener() { return this.http.get<any>(`${this.base}/dashboard`); }
}
//solicitando información al backend para obtener los datos del dashboard, incluyendo KPIs, productos críticos y datos de ventas.