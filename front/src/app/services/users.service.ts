import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from '../class/Users';
import { BASE_URL } from './api.service';
import { LoginResponse, ChangePasswordResponse } from '../class/Login';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = BASE_URL; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/users/login`, { email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Observable<ChangePasswordResponse> {
    const token = localStorage.getItem('token');
    return this.http.put<ChangePasswordResponse>(`${this.baseUrl}/users/change-password`, 
      { old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getUserInfo(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/me`, 
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Student
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`).pipe(
      catchError(this.handleError)
    );
  }

  getStudentById(studentId: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/students/${studentId}`).pipe(
      catchError(this.handleError)
    );
  }

  getStudentSkills(studentId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/students/${studentId}/skills`).pipe(
      catchError(this.handleError)
    );
  }

  getStudentInterests(studentId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/students/${studentId}/subjects`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Handle the error without logging it to the console
    return throwError(() => error);
  }
}