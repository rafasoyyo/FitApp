import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, TabsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class Admin {

  constructor(public router: Router) { }
}
