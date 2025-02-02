import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from './api.service';
import { Project } from '../class/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = BASE_URL; 

  constructor(private http: HttpClient) {}

  getProjects(token: string): Observable<Project[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Project[]>(`${this.baseUrl}/projects`, { headers });
  }
}