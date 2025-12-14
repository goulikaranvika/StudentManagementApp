import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

export interface AuthResponse {
  token: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5115/api/auth'; // CHECK YOUR PORT

  currentUser = signal<string | null>(localStorage.getItem('user_email'));

  constructor(private http: HttpClient, private router: Router) {}

  login(data: LoginRequest): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user_email', data.email);
          this.currentUser.set(data.email);
        }
        return response;
      })
    );
  }

  // --- THE FIX IS HERE ---
  register(data: RegisterRequest): Observable<any> {
    // We add { responseType: 'text' } so Angular doesn't crash on plain text responses
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}