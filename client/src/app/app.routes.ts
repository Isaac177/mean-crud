import { RouterModule, Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EditEmployeeComponent } from "./edit-employee/edit-employee.component";

export const routes: Routes = [
  { path: '', component: EmployeesListComponent, pathMatch: 'full' },
  { path: 'employees/:id', component: EmployeeDetailComponent },
  { path: 'create-employee', component: EmployeeCreateComponent },
  { path: 'edit-employee/:id', component: EditEmployeeComponent },
];
