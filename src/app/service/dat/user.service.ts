import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

export interface ApiResponse {
  error?: boolean;
  message: string;
  // Thêm các trường khác nếu cần
}


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  getAllUser(): Observable<any> {
    return this.http.get(
      'http://localhost:8080/chat_api/api_dat/users/getAllUser.php'
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/chat_api/api_dat/users/getUserById.php?id=${id}`,
      {
        headers: { 'Content-Type': 'application/json' } // Thiết lập header nếu cần				
      }
    )
  }
  getUserInfoByUserId(id: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/chat_api/api_dat/users/info.php?id=${id}`,
      {
        headers: { 'Content-Type': 'application/json' } // Thiết lập header nếu cần				
      }
    )
  }

  getFriendship(userId: number, friendId: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/chat_api/api_dat/users/Friendship.php?user_id=${userId}&friend_id=${friendId}`,
      {
        headers: { 'Content-Type': 'application/json' } // Thiết lập header nếu cần
      }
    );
  }
  getFriends(userId: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/chat_api/api_dat/users/Friendship.php?user_id=${userId}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  getUserInfoByUserIdtest(userId: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/chat_api/api_dat/users/info_test.php?user_id=${userId}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  updateUserInfo(userId: number, userData: any): Observable<any> {
    return this.http.post(
      `http://localhost:8080/chat_api/api_dat/users/updateProfile.php`,
      { user_id: userId, ...userData }, // Gửi name cùng với các trường khác
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  verifyToken(): Observable<any> {
    const token = { token: localStorage.getItem('authToken') || null };
    return this.http
      .post(
        `http://localhost:8080/chat_api/api_dat/auth/verifyToken.php`,
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
  IsAvatarByUser(userId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/chat_api/api_dat/users/GetAvataUserByMedia.php?id=${userId}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  };

  changePassword(payload: { user_id: number, old_password: string, new_password: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`http://localhost:8080/chat_api/api_dat/users/changepassword.php`, payload, 
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
