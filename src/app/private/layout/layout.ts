import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TabsModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout {
  constructor(public router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }
}
