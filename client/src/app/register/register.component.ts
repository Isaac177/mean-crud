import {Component, NgZone} from '@angular/core';
import { UserService } from '../user.service';
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, NgIf, NgForOf,  MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule
  ]
})

export class RegisterComponent {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private ngZone: NgZone,
    private router: Router
    ) {
  }

  register(): void {
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.userService.register(payload).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.authService.setLoggedIn(true);
        this.ngZone.run(() => this.router.navigate(['/employees']));
      },
      error: (error) => {
        alert('Registration failed')
      }
    });
  }
}
