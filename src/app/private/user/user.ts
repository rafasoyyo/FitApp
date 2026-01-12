import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { User as UserDomain } from '../../domain/user/user';
import { UserService } from '../../domain/user/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToggleSwitchModule,
    InputTextModule,
    FloatLabelModule,
    MessageModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class User implements OnInit {

  loggedUser = signal<UserDomain>({} as UserDomain);
  isDarkMode = false;
  loading = signal(false);

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getLoggedUser()
      .then(user => {
        if (user) {
          this.loggedUser.set(user as UserDomain);
          // Set toggle switch based on user preference
          this.isDarkMode = user.darkMode || false;
        }
      });
  }

  async saveProfile() {
    this.loading.set(true);
    try {
      await this.userService.update(this.loggedUser().id, {
        name: this.loggedUser().name,
        phone: this.loggedUser().phone,
        darkMode: this.isDarkMode
      });
      // Optional: show some success toast if you have it
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async logout () {
    await this.userService.logout();
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    document.querySelector('html')?.classList.toggle('my-app-dark', this.isDarkMode);
  }
}
