import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-user',
  imports: [Button, ToggleSwitch, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class User {
  isDarkMode: boolean = false;

  constructor(public router: Router) {
    this.isDarkMode = document.querySelector('html')?.classList.contains('my-app-dark') ?? false;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    document.querySelector('html')?.classList.toggle('my-app-dark', this.isDarkMode);
  }

}
