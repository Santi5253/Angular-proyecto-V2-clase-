import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  error = '';
  cargando = false;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  async submit() {
    this.error = '';
    const Swal = (await import('sweetalert2')).default;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor ingresa usuario y contraseña.',
        confirmButtonColor: '#1e3a8a',
      });
      return;
    }
    this.cargando = true;
    const { username, password } = this.form.getRawValue();
    this.auth.login(username!, password!).subscribe({
      next: async (res: any) => {
        this.cargando = false;
        if (res.success) {
          this.auth.setSession(res.usuario);
          await Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: `Hola ${res.usuario?.nombre ?? username}, has iniciado sesión correctamente.`,
            timer: 1500,
            showConfirmButton: false,
          });
          this.router.navigate(['/inventario']);
        } else {
          this.error = 'Usuario o contraseña incorrectos';
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Usuario o contraseña incorrectos.',
            confirmButtonColor: '#ef4444',
          });
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error de conexión';
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor. Intenta de nuevo.',
          confirmButtonColor: '#ef4444',
        });
        this.cdr.detectChanges();
      },
    });
  }
}
