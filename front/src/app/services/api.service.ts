import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const BASE_URL = 'http://127.0.0.1:8000'; // URL de base de l'API Flask

@Injectable({
  providedIn: 'root'
})

// Mettre les méthodes communes à plusieurs les services ici comme le Login / Logout, 
export class ApiService {
  protected baseUrl = BASE_URL;

  constructor(protected http: HttpClient) {}

  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}