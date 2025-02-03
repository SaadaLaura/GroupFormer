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
   private handleError(error: HttpErrorResponse): Observable<never> {
      return throwError(() => error);
    }
}
