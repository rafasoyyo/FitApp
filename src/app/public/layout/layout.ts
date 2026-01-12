import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CardModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout {
}
