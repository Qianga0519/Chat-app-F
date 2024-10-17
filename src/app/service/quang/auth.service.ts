// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  [x: string]: any;
  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    const data = { email: email, password: password }; // Tạo đối tượng JSON đúng cú pháp
    return this.http
      .post(
        `http://localhost:8080/chat_api/quangApi/auth/login.php`,
        JSON.stringify(data), // Gửi dữ liệu người dùng vào body của request dưới dạng JSON string
        {
          headers: { 'Content-Type': 'application/json' }, // Thiết lập header để chỉ định dữ liệu gửi là JSON
        }
      )
      .pipe(
        tap((response: any) => {
          if (response.success && response.token) {
            // Lưu token và thông tin người dùng vào LocalStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userId', JSON.stringify(response.user.id)); // Lưu thông tin người dùng
            // localStorage.setItem('userData', JSON.stringify(response.user)); // Lưu thông tin người dùng

            // Nếu muốn sử dụng SessionStorage:
            // sessionStorage.setItem('authToken', response.token);
            // sessionStorage.setItem('userData', JSON.stringify(response.user));
          }
        })
      );
  }
}
