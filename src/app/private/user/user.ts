import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-user',
  imports: [Button],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class User {

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }

}
