import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { UserService } from '../../domain/user/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ RouterOutlet, RouterLink, TabsModule, CommonModule, DialogModule ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout implements OnInit {
  private userService = inject(UserService);
  showAbout = signal(false);
  version = signal('1.0.0');
  user = toSignal(this.userService.currentUser$);

  constructor (public router: Router) { }

  ngOnInit (): void {
    this.getVersion();
    this.userService.currentUser$.subscribe(user => {
      document.querySelector('html')?.classList.toggle('my-app-dark', user?.darkMode ?? false);
    });
  }

  getVersion () {
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
