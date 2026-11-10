import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { ProductosService, Producto } from '../../Services/productos.service';
import { VentasService } from '../../Services/ventas.service';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatSelectModule, MatRadioModule, MatTableModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css',
})
export class FacturaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private servicio = inject(ProductosService);
  private ventas = inject(VentasService);

  medios = ['Efectivo', 'Tarjeta', 'Nequi', 'Daviplata'];
  carrito: { producto: Producto; cantidad: number }[] = [];
  factura: any = null;
  error = '';

  datosForm = this.fb.group({
    cliente: ['', Validators.required],
    documento: [''],
    descuento: [0, [Validators.min(0), Validators.max(100)]],
  });
  lineaForm = this.fb.group({
    productoCodigo: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
  });
  pagoForm = this.fb.group({
    medio: ['Efectivo', Validators.required],
    recibido: [0],
    tarjetaNumero: [''],
    tarjetaTitular: [''],
    tarjetaCvv: [''],
    referencia: [''],
  });

  ngOnInit() { this.servicio.refrescar(); }

  get catalogo() { return this.servicio.listar(); }
  get subtotal() { return this.carrito.reduce((a, l) => a + l.producto.precio * l.cantidad, 0); }
  get total() { const d = Number(this.datosForm.controls.descuento.value ?? 0); return Math.round(this.subtotal * (1 - d / 100)); }
  get cambio() { return Number(this.pagoForm.controls.recibido.value ?? 0) - this.total; }

  agregarLinea() {
    this.error = '';
    if (this.lineaForm.invalid) { this.lineaForm.markAllAsTouched(); return; }
    const cod = this.lineaForm.controls.productoCodigo.value!;
    const cant = Number(this.lineaForm.controls.cantidad.value);
    const prod = this.servicio.listar().find((p) => p.codigo === cod);
    if (!prod) { this.error = 'Producto no encontrado'; return; }
    const enCarrito = this.carrito.find((l) => l.producto.codigo === cod)?.cantidad ?? 0;
    if (enCarrito + cant > prod.stock) { this.error = `Stock insuficiente de ${prod.nombre}`; return; }
    const ex = this.carrito.find((l) => l.producto.codigo === cod);
    if (ex) ex.cantidad += cant; else this.carrito.push({ producto: prod, cantidad: cant });
    this.lineaForm.reset({ productoCodigo: '', cantidad: 1 });
  }

  quitarLinea(codigo: string) { this.carrito = this.carrito.filter((l) => l.producto.codigo !== codigo); }

  confirmar() {
    this.error = '';
    if (this.datosForm.invalid) { this.datosForm.markAllAsTouched(); return; }
    if (!this.carrito.length) { this.error = 'Agregue al menos un producto'; return; }
    const medio = this.pagoForm.controls.medio.value!;
    if (medio === 'Efectivo' && this.cambio < 0) { this.error = 'Valor recibido insuficiente'; return; }
    if (medio === 'Tarjeta') {
      const num = (this.pagoForm.controls.tarjetaNumero.value ?? '').replace(/\s/g, '');
      if (!/^\d{16}$/.test(num)) { this.error = 'Tarjeta debe tener 16 dígitos'; return; }
      if (!(this.pagoForm.controls.tarjetaTitular.value ?? '').trim()) { this.error = 'Titular obligatorio'; return; }
      if (!/^\d{3,4}$/.test(this.pagoForm.controls.tarjetaCvv.value ?? '')) { this.error = 'CVV inválido'; return; }
    }
    if ((medio === 'Nequi' || medio === 'Daviplata') && (this.pagoForm.controls.referencia.value ?? '').trim().length < 6) {
      this.error = 'Referencia mínima 6 caracteres'; return;
    }
    const datos = this.datosForm.getRawValue();
    const pago = this.pagoForm.getRawValue();
    this.factura = {
      numero: 'FAC-' + String(Math.floor(Math.random() * 90000) + 10000),
      fecha: new Date(),
      cliente: datos.cliente!,
      documento: datos.documento!,
      lineas: this.carrito.map((l) => ({ ...l })),
      subtotal: this.subtotal,
      descuento: Number(datos.descuento ?? 0),
      total: this.total,
      medioPago: medio,
    };
    const payload = {
      cliente: this.factura.cliente,
      documento: this.factura.documento,
      medio_pago: this.factura.medioPago,
      subtotal: this.factura.subtotal,
      descuento: this.factura.descuento,
      total: this.factura.total,
      items: this.factura.lineas.map((l: any) => ({ codigo: l.producto.codigo, cantidad: l.cantidad, precio_unitario: l.producto.precio, subtotal: l.producto.precio * l.cantidad })),
    };
    this.ventas.registrar(payload).subscribe({ next: () => this.servicio.refrescar(), error: () => {} });
    this.carrito = [];
  }

  nuevaFactura() {
    this.factura = null;
    this.error = '';
    this.datosForm.reset({ descuento: 0 });
    this.pagoForm.reset({ medio: 'Efectivo', recibido: 0 });
  }
}
