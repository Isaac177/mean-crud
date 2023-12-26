import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent {
  employee: Employee = {
    name: '',
    position: '',
    department: ''
  };

  constructor(private employeeService: EmployeeService, private router: Router) {}

  createEmployee(e: any) {
    e.preventDefault();
    this.employeeService.createEmployee(this.employee).subscribe({
      next: (emp) => {
        alert(`Employee ${emp.name} created successfully.`);
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('There was an error creating the employee', error);
      }
    });
  }
}
