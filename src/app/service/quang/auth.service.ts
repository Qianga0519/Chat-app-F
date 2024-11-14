// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { Session } from 'inspector';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  // login(email: string, password: string): Observable<any> {
  //   const data = { email, password };
  //   return this.http
  //     .post(
  //       `http://localhost:8080/chat_api/quangApi/auth/login.php`,
  //       JSON.stringify(data),
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         // withCredentials: true, // Thêm thuộc tính này nếu bạn muốn gửi cookie session
  //       }
  //     )
  //     .pipe(
  //       tap((response: any) => {
  //         if (response.success && response.token) {
  //           localStorage.setItem('authToken', response.token);
  //           // localStorage.setItem('userId', JSON.stringify(response.user.id));
  //           localStorage.setItem('id_user', response.user.id.toString());
  //         }
  //       }),
  //       catchError((error) => {
  //         console.error('Login error', error);
  //         throw error; // Có thể xử lý thêm lỗi ở đây nếu cần
  //       })
  //     );
  // }
  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post(
      `http://localhost:8080/chat_api/quangApi/auth/login.php`,
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // logout(): Observable<any> {
  //   const token =
  //     sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  //   if (token) {
  //     return this.http.post(
  //       `http://localhost:8080/chat_api/quangApi/auth/logout.php`,
  //       { token },
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: true,
  //       }
  //     );
  //   }
  //   return new Observable((observer) => {
  //     observer.next({ success: true }); // Trả về thành công nếu không có token
  //     observer.complete();
  //   });
  // }
  logout(): Observable<any> {
    const token =
      sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    return this.http
      .post(
        `http://localhost:8080/chat_api/quangApi/auth/logout.php`,
        { token },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        tap((response: any) => {
          if (response.success) {
            localStorage.clear();
            sessionStorage.clear();
          }
        }),
        catchError((error) => {
          console.error('Logout failed', error);
          return of(null); // Hoặc bạn có thể trả về một Observable khác tùy theo yêu cầu
        })
      );
  }

  verifyToken(): Observable<any> {
    const token = {
      token:
        sessionStorage.getItem('authToken') ||
        localStorage.getItem('authToken'),
    };
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
  updateStatusOffline(): Observable<any> {
    const token =
      sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    return this.http.post(
      `http://localhost:8080/chat_api/quangApi/auth/updateStatus.php`,
      { token },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
