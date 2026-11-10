import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VentasService } from '../../Services/ventas.service';
import { TablaComponent } from '../../tabla/tabla';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, TablaComponent],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent implements OnInit {
  private ventasService = inject(VentasService);
  private cdr = inject(ChangeDetectorRef);

  ventas: any[] = [];
  filtro = '';

  tableColumns = [
    { key: 'id', header: '#' },
    { key: 'fecha', header: 'Hora', type: 'date' as const },
    { key: 'cliente', header: 'Cliente' },
    { key: 'medio_pago', header: 'Medio' },
    { key: 'total', header: 'Total', type: 'currency' as const },
  ];

  ngOnInit() { this.cargar(); }

  cargar() {
    this.ventas = [];
    this.ventasService.obtenerHoy().subscribe({
      next: (data) => { this.ventas = data ?? []; this.cdr.detectChanges(); },
      error: () => { this.ventas = []; this.cdr.detectChanges(); },
    });
  }

  get ventasHoy() {
    const hoy = new Date().toISOString().slice(0, 10);
    return this.ventas.filter((v: any) => (v.fecha || '').slice(0, 10) === hoy);
  }

  get ventasFiltradas() {
    const t = this.filtro.trim().toLowerCase();
    if (!t) return this.ventasHoy;
    return this.ventasHoy.filter((v: any) =>
      (v.cliente || '').toLowerCase().includes(t) ||
      (v.medio_pago || '').toLowerCase().includes(t) ||
      String(v.id).includes(t)
    );
  }

  get totalHoy() { return this.ventasHoy.reduce((a: number, v: any) => a + Number(v.total), 0); }
  get cantidadHoy() { return this.ventasHoy.length; }
}
