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

  login(email: string, password: string): Observable<any> {
    const data = { email: email, password: password };
    return this.http
      .post(
        `http://localhost:8080/chat_api/quangApi/auth/login.php`,
        JSON.stringify(data),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        tap((response: any) => {
          if (response.success && response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userId', JSON.stringify(response.user.id));
            localStorage.setItem('id_user', response.user.id.toString());
          }
        }),
        catchError((error) => {
          console.error('Login error', error);
          throw error;
        })
      );
  }

  logout(): void {
    // Gửi yêu cầu đến API để xóa token (nếu cần)
    const token = localStorage.getItem('authToken');
    if (token) {
      this.http
        .post(
          `http://localhost:8080/chat_api/quangApi/auth/logout.php`,
          { token },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
        .subscribe(
          () => {
            // Xóa token và thông tin người dùng
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            // Điều hướng người dùng về trang đăng nhập
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Logout error', error);
          }
        );
    } else {
      // Nếu không có token, chỉ cần điều hướng về trang đăng nhập
      this.router.navigate(['/login']);
    }
  }
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
