import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    RouterModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPassword {
  resetForm: FormGroup;
  message: { severity: 'success' | 'error', text: string } | null = null;
  loading = false;

  private auth = inject(Auth);
  private fb = inject(FormBuilder);

  constructor() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async sendResetLink() {
    this.message = null;
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email } = this.resetForm.value;

    try {
      await sendPasswordResetEmail(this.auth, email);
      this.message = {
        severity: 'success',
        text: 'Se ha enviado un enlace de restablecimiento a tu correo. Por favor, revísalo. No olvides mirar la carpeta de spam.'
      };
      this.resetForm.reset();
    } catch (error: any) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      if (error.code === 'auth/user-not-found') {
        this.message = { severity: 'error', text: 'No existe una cuenta con este correo electrónico.' };
      } else if (error.code === 'auth/invalid-email') {
        this.message = { severity: 'error', text: 'El correo electrónico no es válido.' };
      } else {
        this.message = { severity: 'error', text: 'Ocurrió un error. Inténtalo de nuevo más tarde.' };
      }
    } finally {
      this.loading = false;
    }
  }
}
