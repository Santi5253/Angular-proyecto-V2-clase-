import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Producto {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api/v1';
  private _productos = new BehaviorSubject<Producto[]>([]);
  productos$ = this._productos.asObservable();

  refrescar(): void {
    this.http.get<Producto[]>(`${this.base}/productos`).subscribe({
      next: (data) => this._productos.next(data ?? []),
      error: () => this._productos.next([]),
    });
  }

  listar(): Producto[] { return [...this._productos.value]; }

  crear(p: Producto) { return this.http.post<Producto>(`${this.base}/productos`, p); }
  actualizar(codigo: string, cambios: any) { return this.http.put<Producto>(`${this.base}/productos/${codigo}`, cambios); }
  eliminar(codigo: string) { return this.http.delete(`${this.base}/productos/${codigo}`); }

  valorInventario(): number {
    return this.listar().reduce((a, x) => a + x.precio * x.stock, 0);
  }
}
