import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private messagesSubject = new Subject<any>();
  public messages = this.messagesSubject.asObservable();

  constructor() {}

  // Mở kết nối WebSocket
  connect(url: string): void {
    this.socket = new WebSocket(url);

    // Lắng nghe dữ liệu từ server WebSocket
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data); // Giả sử tin nhắn trả về là JSON
        this.messagesSubject.next(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  }

  // Gửi tin nhắn qua WebSocket
  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  // Đóng kết nối WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
