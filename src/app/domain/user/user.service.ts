import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<User> {
  protected override path = 'users';

  getLoggedUser(): Promise<User | null> {
    return Promise.resolve(User.fromJson({
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      phone: '123456789',
      darkMode: false,
      role: 'user',
      verified: true
    }));
  }

  protected override fromJson(json: any): User {
    return User.fromJson(json);
  }
}
