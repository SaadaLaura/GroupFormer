import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { BASE_URL } from './api.service';
import { Announcement } from '../class/Announcement';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private baseUrl = BASE_URL;

  constructor(private http: HttpClient) {}

  getAnnouncements(token: string): Observable<Announcement[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Announcement[]>(`${this.baseUrl}/announcements`,{headers}).pipe(
        catchError(this.handleError)
    );
  }

  getProjectAnnouncements(token : string, projectId: number): Observable<Announcement[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Announcement[]>(`${this.baseUrl}/projects/${projectId}/announcements`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createAnnouncement(token : string, announcement: any): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/announcements/add`, announcement, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAnnouncement(token : string, announcementId: number): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<any>(`${this.baseUrl}/announcements/${announcementId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
      return throwError(() => error);
  }
}
