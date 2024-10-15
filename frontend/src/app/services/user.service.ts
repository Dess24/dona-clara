import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:8000/api'; // URL base de tu API

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

getUserInfo(): Observable<{ user: { admin: number } }> {
    const token = localStorage.getItem('auth_token');
    return this.http.get<{ user: { admin: number } }>(`${this.apiUrl}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}