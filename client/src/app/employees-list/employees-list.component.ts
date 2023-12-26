import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../employee.service';
import {EmployeeDetailComponent} from "../employee-detail/employee-detail.component";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  standalone: true,
  imports: [
    EmployeeDetailComponent, CommonModule, RouterModule
  ],
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  formattedEmployees: Employee[] = [];
  selectedEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService) {
  }
  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0 && Array.isArray(response[0])) {
          this.employees = response[0] as Employee[];
        } else {
          console.error('Invalid data format received:', response);
        }
        console.log('Employees fetched successfully', JSON.stringify(this.employees));
      },
      error: (err) => {
        console.error('Error fetching employees', err);
      }
    });
  }


  deleteEmployee(employeeId: string | undefined): void {
    if(confirm("Are you sure you want to delete this employee?")) {
      this.employeeService.deleteEmployeeById(employeeId).subscribe({
        next: () => {
          // Remove the deleted employee from the local array to update the UI
          this.employees = this.employees.filter(employee => employee._id !== employeeId);
          // Optionally, navigate or refresh the list
        },
        error: (error) => {
          console.error('Error deleting employee', error);
        }
      });
    }
  }


  openDetailsModal(employee: Employee): void {
    this.selectedEmployee = employee;
    // Here, you would handle the logic to display the modal
  }

  closeDetailsModal(): void {
    this.selectedEmployee = null;
    // Handle logic to close the modal
  }

  protected readonly console = console;
  protected readonly JSON = JSON;
}
