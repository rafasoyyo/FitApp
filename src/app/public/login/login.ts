import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, PasswordModule, ButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class Login {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    console.log('Logging in', this.username);
    this.router.navigate(['/calendar']);
  }
}
