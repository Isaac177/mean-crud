import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private currentIsLoggedIn: boolean = false;

  get isLoggedIn() {
    return this._isLoggedIn.asObservable();
  }

  get isLoggedInValue() {
    return !!localStorage.getItem('token');
  }

  setLoggedIn(value: boolean) {
    this._isLoggedIn.next(value);
    this.currentIsLoggedIn = value;
  }
}
