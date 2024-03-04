import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from '../employee.service';
import { FormControl, FormsModule } from "@angular/forms";

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
  employee: Employee = { name: '', position: '', department: '', _id: '' };
  fileControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

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

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log("FileUpload -> files", fileList[0]);
      this.fileControl.setValue(fileList[0]);
    }
  }

  saveEmployee(): void {
    if (this.employee && this.employee._id) {
      const formData = new FormData();
      formData.append('name', this.employee.name);
      formData.append('position', this.employee.position);
      formData.append('department', this.employee.department);

      const file: File | null = this.fileControl.value;
      if (file) {
        formData.append('file', file, file.name);
      }

      this.employeeService.updateEmployeeById(this.employee._id, formData).subscribe({
        next: () => {
          window.alert('Employee updated successfully');
          this.router.navigate(['/employees']);
        },
        error: (error) => console.error(error)
      });
    } else {
      console.error('Employee data is incomplete.');
    }
  }
}
