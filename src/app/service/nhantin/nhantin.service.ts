import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NhantinService {
  constructor(private http: HttpClient) {}

  getChatRoomByUserId(): Observable<any> {
    const userId = localStorage.getItem('userId')!;
    const token = localStorage.getItem('authToken');
    const data = { user_id: userId, token: token };
    return this.http.post(
      `http://localhost:8080/chat_api/nhantinApi/room/getChatRoomsByUserId.php`,
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  getMessagesByRoomId(room_id: Number): Observable<any> {
    return this.http.post(
      `http://localhost:8080/chat_api/nhantinApi/room/getMessagesByRoomId.php`,
      JSON.stringify({room_id: room_id}),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
