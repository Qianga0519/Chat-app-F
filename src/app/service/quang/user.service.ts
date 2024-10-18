import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  createUser(data: any): Observable<any> {
    return this.http.post(
      `http://localhost:8080/chat_api/quangApi/users/createUser.php`,
      data, // Gửi dữ liệu người dùng vào body của request
      {
        headers: { 'Content-Type': 'application/json' }, // Thiết lập header
      }
    );
  }
  getAllUser(): Observable<any>{
    return this.http.get(
      `http://localhost:8080/chat_api/quangApi/users/getAllUser.php`
    )
  }
}
