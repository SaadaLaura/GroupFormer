import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from './api.service';
import { Announcement } from '../class/Announcement';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private baseUrl = BASE_URL;

  constructor(private http: HttpClient) {}

  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.baseUrl}/announcements`);
  }

  getAnnouncementSearch(announcementId: number): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.baseUrl}/announcements/${announcementId}/research`);
  }

  getAnnouncementAbout(announcementId: number): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.baseUrl}/announcements/${announcementId}/about`);
  }
}