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
export class AbilitiesService {
  private baseUrl = BASE_URL; 

  constructor(private http: HttpClient) {}

  getAllSkills(token: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.baseUrl}/skills`,   
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getAllSubjects(token: string): Observable<Interest[]> {
    return this.http.get<Interest[]>(`${this.baseUrl}/subjects`,   
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(
      catchError(this.handleError)
    );
  }
 
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Handle the error without logging it to the console
    return throwError(() => error);
  }
}