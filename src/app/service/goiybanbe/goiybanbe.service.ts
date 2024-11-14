import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoiybanbeService {
  constructor(private http: HttpClient) {}
  getListHint(user_id: number) {
    return this.http.get(
      `http://localhost:8080/chat_api/goiybanbeApi/friend/getFriendByUserId.php?user_id=${user_id}`
    );
  }
}
