import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../class/Student';
import { BASE_URL } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = BASE_URL; 

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/student`);
  }

  getStudentById(studentId: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/student/${studentId}`);
  }

  getStudentSkills(studentId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/student/${studentId}/skills`);
  }

  getStudentInterests(studentId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/student/${studentId}/subjects`);
  }
}