import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NhantinService {
  constructor(private http: HttpClient) {}

  getChatRoomByUserId(): Observable<any> {
    const userId = localStorage.getItem('id_user')!;
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
      JSON.stringify({ room_id: room_id }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  getChatRoomAvatarUser(room_id: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/chat_api/nhantinApi/room/getChatRoomByIdAvatar.php?room_id=${room_id}`
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/chat_api/api_dat/users/getUserById.php?id=${id}`,
      {
        headers: { 'Content-Type': 'application/json' }, // Thiết lập header nếu cần
      }
    );
  }
  // Phương thức gửi tin nhắn
  sendMessage(messageData: {
    content: string;
    user_id: number;
    room_id: number;
    authToken: string;
  }): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8080/chat_api/nhantinApi/message/sendMessage.php`,
      messageData
    );
  }
}
