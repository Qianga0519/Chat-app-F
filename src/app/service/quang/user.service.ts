import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  baseUrl = `http://localhost:8080/chat_api/quangApi/users`
  createUser(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/createUser.php`,
      data, // Gửi dữ liệu người dùng vào body của request
      {
        headers: { 'Content-Type': 'application/json' }, // Thiết lập header
      }
    );
  }
  getAllUser(): Observable<any>{
    return this.http.get(
      `${this.baseUrl}/getAllUser.php`
    )
  }
  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUserById.php?id=${userId}`);
  }
}
