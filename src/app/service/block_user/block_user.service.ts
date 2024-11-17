import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlockUserService {
  constructor(private http: HttpClient) {}

  blockUserRequest(
    user_id: number,
    friend_id: number,
    authToken: string
  ): Observable<any> {
    const data = {
      user_id: user_id,
      friend_id: friend_id,
      authToken: authToken,
    };
    return this.http.post(
      `http://localhost:8080/chat_api/blockuserApi/user/blockUser.php`,
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
