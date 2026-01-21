import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor () {
    this.loginForm = this.fb.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ],
    });
  }

  async login () {
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate([ '/calendar' ]);
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        this.errorMessage = 'Credenciales inválidas. Por favor, revisa tu correo y contraseña.';
      } else if (error.code === 'auth/too-many-requests') {
        this.errorMessage = 'Demasiados intentos fallidos. Inténtalo más tarde.';
      } else {
        this.errorMessage = 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.';
      }
    }
  }

  // async mockLogin (role: 'user' | 'admin') {
  //   const creds = role === 'user'
  //     ? { email: 'user@test.com', password: 'password123' }
  //     : { email: 'admin@test.com', password: 'password123' };

  //   this.loginForm.patchValue(creds);
  //   await this.login();
  // }
}
