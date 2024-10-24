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
import { response } from 'express';

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
  avatar_user2: string = '';
  name_user2: string = '';
  newMessage: string = '';
  notify_message: string = '';
  error: boolean = false;
  private intervalId: any;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  constructor(
    private nhantinService: NhantinService,
    private router: Router,
    private authService: AuthService
  ) {
    this.userId = Number(localStorage.getItem('id_user'));
    this.authToken = String(localStorage.getItem('authToken'));
    if (!this.userId) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
  ngOnInit(): void {
    this.getChatRooms();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Dừng interval khi component bị hủy
  }
  sendMessage(): void {
    this.checkAuth();
    if (!this.newMessage.trim()) return; // Kiểm tra nếu tin nhắn trống
    const messageData = {
      content: this.newMessage,
      user_id: this.userId,
      room_id: this.selectedRoom.id,
      authToken: this.authToken,
    };
    this.nhantinService.sendMessage(messageData).subscribe(
      (response) => {
        if (response.success) {
          this.loadMessages(this.selectedRoom); // Tải lại tin nhắn sau khi gửi thành công
          this.newMessage = ''; // Xóa nội dung textarea sau khi gửi
        } else {
          console.log(response.error);
        }
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }
  getChatRooms(): void {
    this.checkAuth();
    this.nhantinService.getChatRoomByUserId().subscribe(
      (response) => {
        console.log(response);
        if (response.success) {
          this.chatRooms = response.data;
          console.log('list room', this.chatRooms);
        } else {
          this.errorMessage = response.error;
        }
      },
      (error) => {
        console.error('Error fetching messages:', error);
        this.errorMessage = 'Có lỗi xảy ra trong quá trình tải dữ liệu.';
      }
    );
  }

  openChat(room: any): void {
    this.checkAuth();
    this.selectedRoom = room; // Lưu phòng chat đã chọn
    this.loadMessages(room); // Tải tin nhắn của phòng đã chọn ngay khi mở phòng chat
    this.startMessageUpdate(); // Bắt đầu cập nhật tin nhắn định kỳ
    // Lấy avatar của người dùng trong phòng chat
    this.nhantinService
      .getChatRoomAvatarUser(this.selectedRoom.id)
      .subscribe((response) => {
        if (response.success) {
          this.avatar_user2 = response.data.avatar_user_2;
        } else {
          console.log('Error fetching avatar:', response.error); // Thông báo lỗi nếu có
        }
      });
    this.nhantinService
      .getUserById(this.selectedRoom.user_id_2)
      .subscribe((response) => {
        this.name_user2 = response.name;
      });
  }

  loadMessages(room: any): void {
    this.checkAuth();
    this.nhantinService.getMessagesByRoomId(room.id).subscribe(
      // Sửa lại để sử dụng ID phòng
      (response) => {
        console.log(response);
        if (response.success) {
          this.selectedRoom.messages = response.data; // Cập nhật tin nhắn của phòng
          console.log('Loaded messages:', response.data); // Log danh sách tin nhắn đã tải
          this.scrollToBottom();
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

  startMessageUpdate(): void {
    this.intervalId = setInterval(() => {
      if (this.selectedRoom) {
        this.loadMessages(this.selectedRoom); // Tải lại tin nhắn mỗi giây
      }
    }, 5000); // Thay đổi khoảng thời gian (5000ms = 5s) nếu cần
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
