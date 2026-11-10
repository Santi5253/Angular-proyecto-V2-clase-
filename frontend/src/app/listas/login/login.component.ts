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

  submit() {
    this.error = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.cargando = true;
    const { username, password } = this.form.getRawValue();
    this.auth.login(username!, password!).subscribe({
      next: (res: any) => {
        this.cargando = false;
        if (res.success) {
          this.auth.setSession(res.usuario);
          this.router.navigate(['/inventario']);
        } else {
          this.error = 'Usuario o contraseña incorrectos';
        }
        this.cdr.detectChanges();
      },
      error: () => { this.cargando = false; this.error = 'Error de conexión'; this.cdr.detectChanges(); },
    });
  }
}
