import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from './api.service';
import { Project } from '../class/Project';
import { Announcement } from '../class/Announcement';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = BASE_URL; 

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }

  getProjectAnnouncements(projectId: number): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.baseUrl}/projects/${projectId}/announcements`);
  }
}