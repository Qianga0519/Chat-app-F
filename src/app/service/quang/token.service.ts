import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'authToken'; // Khóa lưu trữ token
  constructor(private http: HttpClient) {}
  // Lưu token vào localStorage
  checkTokenMatch(token: string): Observable<any> {
    const data = { token };
    return this.http.post(
      `http://localhost:8080/chat_api/quangApi/token/verifyToken.php`,
      data, // Gửi dữ liệu người dùng vào body của request
      {
        headers: { 'Content-Type': 'application/json' }, // Thiết lập header
      }
    );
  }
  isLoggedIn(): boolean {
    // Kiểm tra xem token có tồn tại không
    const token = localStorage.getItem('token'); // Hoặc phương thức khác để lấy token
    return !!token; // Trả về true nếu có token, false nếu không
  }
  login(userData: any) {
    return this.http.post('http://your-api/login', userData).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token); // Lưu token
      })
    );
  }
}
