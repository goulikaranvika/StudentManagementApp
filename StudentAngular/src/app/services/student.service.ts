import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Updated Interface based on your HTML
export interface Student {
  id: number;
  name: string;
  class: string;
  section: string;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = 'http://localhost:5115/api/students'; // Check your port

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  update(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}