import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { BASE_URL } from './api.service';
import { Project } from '../class/Project';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = BASE_URL; 

  constructor(private http: HttpClient) {}

  getProjects(token: string): Observable<Project[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Project[]>(`${this.baseUrl}/projects`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getProjectsWithoutStudents(token: string): Observable<Project[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Project[]>(`${this.baseUrl}/projects/empty`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addProject(token: string, project: Project): Observable<Project> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
    return this.http.post<Project>(`${this.baseUrl}/projects/add`, project, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateProject(token: string, projectId: number, project: Project): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.baseUrl}/projects/${projectId}`, project, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteProject(token: string, projectId: number): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<any>(`${this.baseUrl}/projects/${projectId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

}