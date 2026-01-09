import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputTextModule, PasswordModule, ButtonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class Register {
  username = '';
  password = '';

  constructor(private router: Router) {}

  register() {
    console.log('Registering', this.username);
    this.router.navigate(['/calendar']);
  }
}
