import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  get usuario() { return this.auth.usuario; }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }

  // Devuelve las iniciales en mayúscula del nombre del cliente/usuario.
  obtenerIniciales(nombre: string): string {
    if (!nombre) {
      return '';
    }
    const partes = nombre.trim().split(' ');
    let iniciales = '';
    if (partes[0]) {
      iniciales = iniciales + partes[0].charAt(0).toUpperCase();
    }
    if (partes.length > 1 && partes[1]) {
      iniciales = iniciales + partes[1].charAt(0).toUpperCase();
    }
    return iniciales;
  }
}
