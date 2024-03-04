import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';

export interface Employee {
  _id?: string;
  name: string;
  position: string;
  department: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/employees';

  constructor(private http: HttpClient) { }

  // Get all employees
  getEmployees(): Observable<Employee[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => Object.values(data))
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  // Create a new employee
  createEmployee(employeeData: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employeeData);
  }

  // Update an employee by ID
    updateEmployeeById(id: string | undefined, employeeData: FormData): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employeeData);
  }

  // Delete an employee by ID
  deleteEmployeeById(id: string | undefined): Observable<Employee> {
    return this.http.delete<Employee>(`${this.apiUrl}/${id}`);
  }
}
