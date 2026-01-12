import { Injectable, inject } from '@angular/core';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { CrudService } from '../crud.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<User> {
  protected override path = 'users';
  private auth = inject(Auth);

  private _currentUser$ = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser$.asObservable();

  constructor () {
    super();
    // Suscribirse al estado de autenticación para mantener el usuario actualizado
    authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          return this.get$(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      this._currentUser$.next(user || null);
    });
  }

  async getLoggedUser (): Promise<User | null> {
    const user = await firstValueFrom(authState(this.auth));
    if (!user) return null;

    const userData = await this.get(user.uid);
    return userData || null;
  }

  async logout (): Promise<void> {
    await signOut(this.auth);
  }

  protected override fromJson(json: any): User {
    return User.fromJson(json);
  }
}
