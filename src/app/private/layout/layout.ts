import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TabsModule, CommonModule, DialogModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout implements OnInit {
  showAbout = signal(false);
  version = signal('1.0.0');

  constructor(public router: Router) { }

  ngOnInit(): void {
    fetch('https://fitcenter.web.app/ngsw.json')
      .then(res => res.json())
      .then(data => {
        if (data.appData && data.appData.version) {
          this.version.set(data.appData.version);
        }
      })
      .catch(err => console.error('Error reading ngsw.json', err));
  }
}
