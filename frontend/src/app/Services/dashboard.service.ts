import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;
  obtener() { return this.http.get<any>(`${this.base}/dashboard`); }
}
//solicitando información al backend para obtener los datos del dashboard, incluyendo KPIs, productos críticos y datos de ventas.
