import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = BASE_URL; 

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/project`);
  }

  getProjectAnnouncements(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/project/${projectId}/announcement`);
  }
}