import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<User> {
  protected override path = 'users';

  protected override fromJson(json: any): User {
    return User.fromJson(json);
  }
}
