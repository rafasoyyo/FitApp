import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { UserService } from '../../domain/user/user.service';

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

  constructor (public router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      document.querySelector('html')?.classList.toggle('my-app-dark', user?.darkMode ?? false);
    });

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
