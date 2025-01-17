import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000'; // URL de base de l'API Flask

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/project`);
  }

  getAnnouncements(): Observable<any> {
    return this.http.get(`${this.baseUrl}/announcement`);
  }

  getProjectAnnouncements(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/project/${projectId}/announcement`);
  }

  getAnnouncementSearch(announcementId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/announcement/${announcementId}/search`);
  }
}