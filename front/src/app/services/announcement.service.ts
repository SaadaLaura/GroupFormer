import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private baseUrl = BASE_URL; 
  
  constructor(private http: HttpClient) {}

  getAnnouncements(): Observable<any> {
    return this.http.get(`${this.baseUrl}/announcement`);
  }

  getAnnouncementSearch(announcementId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/announcement/${announcementId}/research`);
  }

  getAnnouncementAbout(announcementId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/announcement/${announcementId}/about`);
  }
}