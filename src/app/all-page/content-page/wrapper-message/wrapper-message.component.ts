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
  styleUrl: 'message.css',
  providers: [NhantinService],
})
export class WrapperMessageComponent implements OnInit {
  chatRooms: any[] = [];
  errorMessage: string | null = null;
  selectedRoom: any;
  userId: number;
  avatar_user2: string = '';
  name_user2: string = '';
  newMessage: string = '';
  private intervalId: any;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  constructor(private nhantinService: NhantinService, private router: Router) {
    this.userId = Number(localStorage.getItem('id_user'));
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
    if (!this.newMessage.trim()) return; // Kiểm tra nếu tin nhắn trống
    const messageData = {
      content: this.newMessage,
      user_id: this.userId,
      room_id: this.selectedRoom.id,
    };
    this.nhantinService.sendMessage(messageData).subscribe(
      (response) => {
        if (response.success) {
          this.loadMessages(this.selectedRoom); // Tải lại tin nhắn sau khi gửi thành công
          this.newMessage = ''; // Xóa nội dung textarea sau khi gửi
        } else {
          console.log(response);
        }
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }

  getChatRooms(): void {
    this.nhantinService.getChatRoomByUserId().subscribe(
      (response) => {
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
    this.selectedRoom = room; // Lưu phòng chat đã chọn
    this.loadMessages(room); // Gọi hàm tải tin nhắn ngay khi mở phòng chat
    this.startMessageUpdate();
    // Tải avatar người dùng
    this.nhantinService
      .getChatRoomAvatarUser(this.selectedRoom.id)
      .subscribe((response) => {
        if (response.success) {
          this.avatar_user2 = response.data.avatar_user_2;
        } else {
          console.log(response);
        }
      });

    // Tải thông tin người dùng
    this.nhantinService.getUserById(room.user_id_2).subscribe((response) => {
      if (response.success) {
        this.name_user2 = response.data.name; // Cập nhật tên người dùng
      } else {
        console.log(response);
      }
    });
  }

  loadMessages(room: any): void {
    this.nhantinService.getMessagesByRoomId(room.id).subscribe(
      // Sửa lại để sử dụng ID phòng
      (response) => {
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
}
