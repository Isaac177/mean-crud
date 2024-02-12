import {ChangeDetectorRef, Component, NgModule, OnInit} from '@angular/core';
import { EmployeeService, Employee } from './employee.service';
import {Router, RouterOutlet} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {FormsModule, NgModel} from "@angular/forms";
import { UserService } from './user.service';
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatButtonModule,
    FormsModule,
  ],
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  employees: Employee[] = [];

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
    ) {}

  ngOnInit() {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
    });
  }

  logout() {
    this.userService.logout().subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.authService.setLoggedIn(false);
      this.router.navigate(['/login']);
      this.changeDetectorRef.detectChanges();
    });
  }
}
