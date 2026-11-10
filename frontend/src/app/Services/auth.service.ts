import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api/v1';

  login(username: string, password: string) {
    return this.http.post<any>(`${this.base}/auth/login`, { usuario: username, contrasena: password });
  }

  logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('usuario');
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem('loggedIn') === 'true';
  }

  get usuario(): any {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }

  setSession(user: any) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('usuario', JSON.stringify(user));
  }
}
