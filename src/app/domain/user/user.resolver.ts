import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user';

export const userResolver: ResolveFn<User | null> = (route, state) => {
  const userService = inject(UserService);
  return userService.getLoggedUser();
};
