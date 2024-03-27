import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from "../user.service";
import {MatCardModule} from "@angular/material/card";
import {Router} from '@angular/router';
import {NgZone} from '@angular/core';
import {AuthService} from "../auth.service";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  forgotPasswordForm: FormGroup = new FormGroup({
    forgotEmail: new FormControl('', [Validators.required, Validators.email]),
    otp: new FormControl('')
  });

  resetPasswordForm: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required])
  });

  showForgotPasswordForm = false;
  showResetPasswordForm = false;

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
          this.authService.setLoggedIn(true);
          this.ngZone.run(() => this.router.navigate(['/employees']));
        },
        (error) => {
          alert('Login failed');
          if (error.status === 429) {
            alert('Too many requests. Please try again later.');
          }
        }
      );
    } else {
      alert('Please fill in the form correctly.');
    }
  }

  onSendEmail() {
    if (this.forgotPasswordForm.get('forgotEmail')?.valid) {
      const email = this.forgotPasswordForm.get('forgotEmail')?.value;
      this.userService.sendOtp(email).subscribe(
        (response: any) => {
          if (response.message === 'OTP sent to email') {
            this.forgotPasswordForm.get('otp')?.setValidators([Validators.required]);
            this.forgotPasswordForm.get('otp')?.updateValueAndValidity();
            alert('OTP sent to your email');
          } else {
            alert('Failed to send OTP');
          }
        },
        (error) => {
          alert('Failed to send OTP');
          if (error.status === 429) {
            alert('Too many requests. Please try again later.');
          }
        }
      );
    } else {
      alert('Please enter a valid email.');
    }
  }

  onVerifyOtp() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('forgotEmail')?.value;
      const otp = this.forgotPasswordForm.get('otp')?.value;
      this.userService.verifyOtp(email, otp).subscribe(
        (response) => {
          this.showForgotPasswordForm = false;
          this.showResetPasswordForm = true;
          alert('OTP verified');
        },
        (error) => {
          alert('Failed to verify OTP');
          if (error.status === 429) {
            alert('Too many requests. Please try again later.');
          }
        }
      );
    } else {
      alert('Please enter a valid OTP.');
    }
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('forgotEmail')?.value;
      const otp = this.forgotPasswordForm.get('otp')?.value;
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;
      const repeatPassword = this.resetPasswordForm.get('repeatPassword')?.value;

      if (newPassword !== repeatPassword) {
        alert('Passwords do not match');
        return;
      }

      this.userService.resetPassword(email, otp, newPassword).subscribe(
        (response: any) => {
          if (response.message === 'Failed to reset password') {
            alert('Failed to reset password');
          } else {
            alert('Password reset successful');
            window.location.reload();
          }
        },
        (error) => {
          alert('Failed to reset password');
          if (error.status === 429) {
            alert('Too many requests. Please try again later.');
          }
        }
      );
    } else {
      alert('Please enter a valid password.');
    }
  }
}
