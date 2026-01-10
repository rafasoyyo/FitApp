import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { User } from '../../domain/user/user';
import { UserService } from '../../domain/user/user.service';


@Component({
  selector: 'app-admin-users',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ListboxModule,
    ToggleSwitchModule,
    CardModule
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AdminUsers implements OnInit {

  users = signal<User[]>([]);

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(): Promise<User[]> {
    return this.userService.list()
      .then(users => {
        this.users.set(users);
        return users;
      });
  }

  toggleVerified(user: User, newStatus: boolean) {
    this.userService.update(user.id, { verified: newStatus })
      .catch(error => {
        console.error('Error updating user verification status:', error);
      });
  }
}
