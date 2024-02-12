import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from "../user.service";
import {MatCardModule} from "@angular/material/card";
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import {AuthService} from "../auth.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService) {
  }


  onLogin() {
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value;
      this.userService.login(email, password).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.authService.setLoggedIn(true); // Update the authentication state
          this.ngZone.run(() => this.router.navigate(['/employees']));
        },
        (error) => {
          alert('Login failed');
        }
      );
    } else {
      alert('Please fill in the form correctly.');
    }
  }
}
