import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  getAllUser(): Observable<any> {
    return this.http.get(
      'http://localhost:8080/quocdat/chat_online_api/api_dat/users/getAllUser.php'
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/quocdat/chat_online_api/api_dat/users/getUserById.php?id=${id}`,
      {
        headers: { 'Content-Type': 'application/json' } // Thiết lập header nếu cần				
      }
    )
  }
  getUserInfoByUserId(id: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/quocdat/chat_online_api/api_dat/users/info.php?id=${id}`,
      {
        headers: { 'Content-Type': 'application/json' } // Thiết lập header nếu cần				
      }
    )
  }

  getFriendship(userId: number, friendId: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/quocdat/chat_online_api/api_dat/users/Friendship.php?user_id=${userId}&friend_id=${friendId}`,
      {
        headers: { 'Content-Type': 'application/json' } // Thiết lập header nếu cần
      }
    );
  }
  getFriends(userId: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/quocdat/chat_online_api/api_dat/users/Friendship.php?user_id=${userId}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  getUserInfoByUserIdtest(userId: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/quocdat/chat_online_api/api_dat/users/info_test.php?user_id=${userId}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  updateUserInfo(userId: number, userData: any): Observable<any> {
    return this.http.post(
      `http://localhost:8080/quocdat/chat_online_api/api_dat/users/updateProfile.php`,
      { user_id: userId, ...userData }, // Gửi name cùng với các trường khác
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
}
}


