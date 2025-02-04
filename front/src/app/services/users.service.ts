import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from '../class/Users';
import { LoginResponse, ChangePasswordResponse } from '../class/Login';
import { BASE_URL } from './api.service';
import { Skill, Interest } from '../class/Users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = BASE_URL; 

  constructor(private http: HttpClient) {}

  //Pour les utilisateurs 
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
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Student>(`${this.baseUrl}/users/me`,{ headers}).pipe(
      catchError(this.handleError)
    );
  }

  //Pour les Students
  getStudentsWithoutProject(token: string): Observable<Student[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Student[]>(`${this.baseUrl}/students/alone`,{ headers }).pipe(
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
  
  addSkillToStudent(token: string, skill: Skill): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<any>(`${this.baseUrl}/students/skills`, [skill], { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addInterestToStudent(token: string, interest: Interest): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<any>(`${this.baseUrl}/students/subjects`, [interest], { headers }).pipe(
      catchError(this.handleError)
    );
  }

  quitProject(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<any>(`${this.baseUrl}/students/quit-project`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  removeInterestFromStudent(token: string, interest: Interest): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
    return this.http.request<any>('delete', `${this.baseUrl}/students/subjects`, { headers, body:[interest] }).pipe(
      catchError(this.handleError)
    );
  }
  
  removeSkillFromStudent(token: string, skill: Skill): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.request<any>('delete', `${this.baseUrl}/students/skills`, { headers, body: [skill] }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Handle the error without logging it to the console
    return throwError(() => error);
  }
}