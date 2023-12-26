
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import { EmployeeService, Employee } from '../employee.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    NgIf, RouterModule
  ],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})

export class EmployeeDetailComponent implements OnInit {
  @Input() employee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute
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
}

