import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../class/Student';
import { BASE_URL } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = BASE_URL; // Utilisation de la base URL depuis config.ts

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/student`);
  }
}