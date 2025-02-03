import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Interest, Skill } from '../class/Users';
import { BASE_URL } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AbilitiesService {
  private baseUrl = BASE_URL; 

  constructor(private http: HttpClient) {}

  getAllSkills(token: string): Observable<Skill[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Skill[]>(`${this.baseUrl}/skills`,{headers}).pipe(
      catchError(this.handleError)
    );
  }

  getAllSubjects(token: string): Observable<Interest[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Interest[]>(`${this.baseUrl}/subjects`, {headers}).pipe(
      catchError(this.handleError)
    );
  }
 
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}