import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student, Interest, Skill } from '../class/Users';
import { LoginResponse, ChangePasswordResponse } from '../class/Login';
import { BASE_URL } from './api.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
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

  getUserInfo(token: string): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/users/me`, 
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(
      catchError(this.handleError)
    );
  }

  uploadStudents(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/users/upload-students`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private getUserIdFromToken(token: string): number {
    const decoded: any = jwtDecode(token);
    return decoded.id;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Handle the error without logging it to the console
    return throwError(() => error);
  }
}