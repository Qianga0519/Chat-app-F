import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { WrapperRightComponent } from '../wrapper-right/wrapper-right.component';
import { WrapperLeftComponent } from '../wrapper-left/wrapper-left.component';
import { FooterComponent } from '../../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { NhantinService } from '../../../service/nhantin/nhantin.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/quang/auth.service';
import { WebSocketService } from '../../../service/nhantin/websocket.service';

@Component({
  selector: 'app-wrapper-message',
  standalone: true,
  imports: [
    HttpClientModule,
    HeaderComponent,
    WrapperRightComponent,
    WrapperLeftComponent,
    FooterComponent,
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './wrapper-message.component.html',
  providers: [NhantinService, AuthService],
})
export class WrapperMessageComponent implements OnInit {
  chatRooms: any[] = [];
  errorMessage: string | null = null;
  selectedRoom: any;
  userId: number;
  authToken: string;
  avatar_user: string = '';
  user_id_2: number = 0;
  avatar_user2: string = '';
  name_user2: string = '';
  newMessage: string = '';
  notify_message: string = '';
  error: boolean = false;
  private intervalId: any;
  messages: any[] = [];
  path_media = 'http://localhost:8080/chat_api/uploads';
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  subscription: any;
  constructor(
    private nhantinService: NhantinService,
    private router: Router,
    private authService: AuthService,
    private socketService: WebSocketService
  ) {
    this.socketService.connect();
    this.userId = Number(
      localStorage.getItem('id_user') || sessionStorage.getItem('id_user')
    );
    this.authToken = String(
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    );
    if (!this.userId) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
    this.nhantinService
      .getAvatarUser(this.userId)
      .subscribe((response: any) => {
        this.avatar_user = response.data[0].url;
      });
  }
  ngOnInit(): void {
    this.socketService.connect();
    this.getChatRooms();
    // Đăng ký nhận tin nhắn qua WebSocket
    this.socketService.messages.subscribe((message) => {
      if (message) {
        this.scrollToBottom();
        console.log('New message:', message);
        this.messages.push(message); // Cập nhật dữ liệu khi nhận được tin nhắn mới
        console.log(this.messages);
      }
    });
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
    this.socketService.disconnect();
  }
  async getChatRooms(): Promise<void> {
    this.checkAuth();
    try {
      // Lấy dữ liệu phòng chat từ API
      const response = await this.nhantinService
        .getChatRoomByUserId()
        .toPromise();

      if (response.success) {
        this.chatRooms = response.data;
        console.log('List room', this.chatRooms);

        for (let item of this.chatRooms) {
          if (item.user_id_2 === this.userId) {
            const id_tmp = item.user_id_1;

            // Cập nhật lại thông tin user_id
            item.user_id_1 = this.userId;
            item.user_id_2 = id_tmp;

            try {
              // Lấy avatar của người dùng 2
              const avatarResponse: any = await this.nhantinService
                .getAvatarUser(id_tmp)
                .toPromise();
              // Cập nhật thông tin avatar vào item
              item.user2_avatar = avatarResponse.data[0].url;
              console.log('Avatar for user 2:', avatarResponse.data[0].url);
            } catch (avatarError) {
              console.error('Error fetching avatar:', avatarError);
              item.user2_avatar = ''; // Nếu có lỗi, có thể gán giá trị mặc định
            }
          }
        }

        console.log('Updated list with avatars', this.chatRooms);
      } else {
        this.errorMessage = response.error;
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      this.errorMessage = 'Có lỗi xảy ra trong quá trình tải dữ liệu.';
    }
  }

  sendMessage(): void {
    const messageData = {
      content: this.newMessage,
      user_id: this.userId,
      room_id: this.selectedRoom.id,
      authToken: this.authToken,
    };
    this.nhantinService.sendMessage(messageData).subscribe(
      (response) => {
        if (response.success) {
          this.newMessage = ''; // Xóa nội dung textarea sau khi gửi
          this.socketService.sendMessage(messageData);
        } else {
          console.log(response.error);
        }
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }
  openChat(room: any): void {
    this.checkAuth();
    this.selectedRoom = room;
    this.loadMessages(room);

    this.nhantinService
      .getUserById(this.selectedRoom.user_id_2)
      .subscribe((response) => {
        this.name_user2 = response.name;
        this.avatar_user2 = response.url;
        console.log(response);
      });
  }

  loadMessages(room: any): void {
    this.checkAuth();
    this.nhantinService.getMessagesByRoomId(room.id).subscribe(
      (response) => {
        if (response.success) {
          this.messages = response.data;
          console.log('danh sach tin nhan', this.messages);
        } else {
          this.errorMessage = response.error; // Lưu thông báo lỗi
        }
      },
      (error) => {
        console.error('Error loading messages:', error);
        this.errorMessage = 'Lỗi khi tải tin nhắn.'; // Thông báo lỗi
      }
    );
  }
  checkAuth() {
    this.authService.verifyToken().subscribe((response) => {
      if (response.success != true) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
  goBack(): void {
    this.selectedRoom = null; // Trở lại danh sách phòng chat
  }
  scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    }, 100); // Đợi một chút để đảm bảo nội dung đã được cập nhật
  }
  showNotification(message: any) {
    this.notify_message = message;
    this.error = true;
    setTimeout(() => {
      this.error = false;
    }, 3000);
  }
  closeNotification() {
    this.error = false;
  }
}
