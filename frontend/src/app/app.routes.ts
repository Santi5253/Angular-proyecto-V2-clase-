import { Routes } from '@angular/router';
import { LoginComponent } from './listas/login/login.component';
import { InventarioComponent } from './Views/inventario/inventario.component';
import { FacturaComponent } from './Views/factura/factura.component';
import { HistorialComponent } from './Views/historial/historial.component';
import { DashboardComponent } from './Views/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'factura', component: FacturaComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'dashboard', component: DashboardComponent },
];
