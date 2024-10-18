// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  verifyToken(): Observable<any> {
    const token = { token: localStorage.getItem('authToken') || null };
    return this.http
      .post(
        `http://localhost:8080/chat_api/quangApi/auth/verifyToken.php`,
        token,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Token verification error', error);
          throw error; // Hoặc xử lý lỗi ở đây
        })
      );
  }
}
