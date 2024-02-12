import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  login(email: string | undefined, password: string | undefined): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  register(payload: {
    password: string | undefined;
    confirmPassword: string | undefined;
    email: string | undefined;
    username: string | undefined
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }


  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }
}
