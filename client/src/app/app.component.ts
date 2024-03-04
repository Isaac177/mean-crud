import {ChangeDetectorRef, Component, NgModule, OnInit, OnDestroy} from '@angular/core';
import { EmployeeService, Employee } from './employee.service';
import {Router, RouterOutlet} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {FormsModule, NgModel} from "@angular/forms";
import { UserService } from './user.service';
import {AuthService} from "./auth.service";
import { WebSocketService } from './WebSocketService';
import { Subscription } from 'rxjs';

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

export class AppComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  private messagesSubscription?: Subscription;

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private webSocketService: WebSocketService
    ) {}

  ngOnInit() {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
    });

    this.webSocketService.connect('http://localhost:3000');

    this.messagesSubscription = this.webSocketService.onMessage().subscribe(
      message => {
        console.log('Received message:', message);
      },
      error => {
        console.error('WebSocket error:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
    this.webSocketService.close();
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

  public sendMessage(): void {
    this.webSocketService.send('Hello from Angular');
  }
}
