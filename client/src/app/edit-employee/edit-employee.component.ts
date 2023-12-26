import {Component, NgModule, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from '../employee.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  standalone: true,
  imports: [
    FormsModule,
  ],
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  employee: Employee = {name: '', position: '', department: ''};

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe({
        next: (employee: Employee) => {
          this.employee = employee;
        },
        error: (error) => {
          console.error('Error fetching employee details', error);
        }
      });
    } else {
      console.error('No employee ID provided in the route.');
    }
  }


  saveEmployee(): void {
    if (this.employee && this.employee._id) {
      this.employeeService.updateEmployeeById(this.employee._id, this.employee).subscribe({
        next: () => {
          window.alert('Employee updated successfully');
          this.router.navigate(['/employees'])
        },
        error: (error) => console.error(error)
      });
    } else {
      console.error('Employee data is incomplete.');
    }
  }
}
