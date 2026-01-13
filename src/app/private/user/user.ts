import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
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
    MessageModule,
    DialogModule,
    PasswordModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class User implements OnInit {

  loggedUser = signal<UserDomain>({} as UserDomain);
  loading = signal(false);

  visiblePasswordDialog = signal(false);
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordLoading = signal(false);
  passwordError = signal('');

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getLoggedUser()
      .then(user => {
        if (user) {
          this.loggedUser.set(user as UserDomain);
        }
      });
  }

  async saveProfile() {
    this.loading.set(true);
    try {
      await this.userService.update(this.loggedUser().id, {
        name: this.loggedUser().name,
        phone: this.loggedUser().phone,
        darkMode: this.loggedUser().darkMode
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
    document.querySelector('html')?.classList.toggle('my-app-dark', this.loggedUser().darkMode);
  }

  async updatePassword () {
    if (this.newPassword !== this.confirmPassword) {
      return;
    }
    this.passwordLoading.set(true);
    this.passwordError.set('');
    try {
      // Re-authenticate first to avoid 'requires-recent-login' error
      await this.userService.reauthenticate(this.currentPassword);

      // Now change the password
      await this.userService.changePassword(this.newPassword);

      this.visiblePasswordDialog.set(false);
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        this.passwordError.set('La contraseña actual es incorrecta.');
      } else {
        this.passwordError.set('Ocurrió un error al cambiar la contraseña. Inténtalo de nuevo.');
      }
    } finally {
      this.passwordLoading.set(false);
    }
  }
}
