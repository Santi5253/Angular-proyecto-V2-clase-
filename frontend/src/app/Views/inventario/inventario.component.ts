import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductosService, Producto } from '../../Services/productos.service';
import { TablaComponent } from '../../tabla/tabla';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatSelectModule, TablaComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private servicio = inject(ProductosService);

  private cdr = inject(ChangeDetectorRef);

  categorias = ['Cigarrillos', 'Bebidas', 'Dulces', 'Abarrotes', 'Licores', 'Otros'];
  productos: Producto[] = [];
  editando: string | null = null;
  error = '';
  filtro = '';

  form = this.fb.group({
    codigo: ['', [Validators.required, Validators.minLength(3)]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Bebidas', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  tableColumns = [
    { key: 'codigo', header: 'Código' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'categoria', header: 'Categoría', type: 'badge' as const },
    { key: 'precio', header: 'Precio', type: 'currency' as const },
    { key: 'stock', header: 'Stock', type: 'number' as const },
    { key: 'total', header: 'Total', type: 'currency' as const },
    { key: 'actions', header: 'Acciones' },
  ];

  ngOnInit() { this.servicio.refrescar(); this.servicio.productos$.subscribe((d) => { this.productos = d; this.cdr.detectChanges(); }); }

  guardar() {
    this.error = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const producto: Producto = { codigo: v.codigo!.trim().toUpperCase(), nombre: v.nombre!.trim(), categoria: v.categoria!, precio: Number(v.precio), stock: Number(v.stock) };
    if (this.editando) {
      this.servicio.actualizar(this.editando, producto).subscribe({ next: () => this.servicio.refrescar(), error: () => (this.error = 'No se pudo actualizar') });
    } else {
      this.servicio.crear(producto).subscribe({ next: () => this.servicio.refrescar(), error: () => (this.error = 'No se pudo crear') });
    }
    this.cancelar();
  }

  editar(p: Producto) {
    this.editando = p.codigo;
    this.form.setValue({ codigo: p.codigo, nombre: p.nombre, categoria: p.categoria, precio: p.precio, stock: p.stock });
  }

  eliminar(codigo: string) {
    if (!confirm(`¿Eliminar ${codigo}?`)) return;
    this.servicio.eliminar(codigo).subscribe({ next: () => this.servicio.refrescar(), error: () => (this.error = 'No se pudo eliminar') });
    if (this.editando === codigo) this.cancelar();
  }

  cancelar() {
    this.editando = null;
    this.error = '';
    this.form.reset({ categoria: 'Bebidas', precio: 0, stock: 0 });
  }

  get valorInventario() { return this.servicio.valorInventario(); }
  get productosFiltrados() { const t = this.filtro.trim().toLowerCase(); if (!t) return this.productos; return this.productos.filter((x) => x.nombre.toLowerCase().includes(t) || x.codigo.toLowerCase().includes(t) || x.categoria.toLowerCase().includes(t)); }
}
