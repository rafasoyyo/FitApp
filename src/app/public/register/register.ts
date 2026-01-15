import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor () {
    this.registerForm = this.fb.group(
      {
        nombre: [ '', [ Validators.required ] ],
        email: [ '', [ Validators.required, Validators.email ] ],
        password: [ '', [ Validators.required, Validators.minLength(6) ] ],
        confirmPassword: [ '', [ Validators.required ] ],
        telefono: [ '' ],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator (g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async register () {
    this.errorMessage = null;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre, email, password, telefono } = this.registerForm.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Actualizar el perfil con el nombre
      await updateProfile(user, { displayName: nombre });

      // Guardar información adicional en Firestore
      await setDoc(doc(this.firestore, 'users', user.uid), {
        id: user.uid,
        name: nombre,
        email: email,
        phone: telefono || '',
        role: 'user',
        verified: false,
        darkMode: false,
      });

      this.router.navigate([ '/calendar' ]);
    } catch (error: any) {
      console.error('Error durante el registro:', error);
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'El correo electrónico ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El correo electrónico no es válido.';
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage = 'La contraseña es muy débil.';
      } else {
        this.errorMessage = 'Ocurrió un error durante el registro. Inténtalo de nuevo.';
      }
    }
  }
}
