import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  get usuario() { return this.auth.usuario; }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
