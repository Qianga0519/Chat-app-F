import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { WrapperRightComponent } from '../wrapper-right/wrapper-right.component';
import { WrapperLeftComponent } from '../wrapper-left/wrapper-left.component';
import { FooterComponent } from '../../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { NhantinService } from '../../../service/nhantin/nhantin.service';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './wrapper-message.component.html',
  providers: [NhantinService],
})
export class WrapperMessageComponent implements OnInit {
  chatRooms: any[] = []; // Biến lưu trữ danh sách phòng chat
  errorMessage: string | null = null;
  selectedRoom: any; // Phòng chat đã chọn
  userId: number; // ID người dùng

  constructor(private nhantinService: NhantinService) {
    this.userId = Number(localStorage.getItem('id_user')); // Lấy userId từ localStorage
  }

  ngOnInit(): void {
    this.getChatRooms();
  }

  getChatRooms(): void {
    this.nhantinService.getChatRoomByUserId().subscribe(
      // Gọi với userId
      (response) => {
        if (response.success) {
          this.chatRooms = response.data; // Lưu danh sách phòng chat vào biến
          console.log('list room', this.chatRooms);
        } else {
          this.errorMessage = response.error; // Lưu thông báo lỗi
        }
      },
      (error) => {
        console.error('Error fetching messages:', error);
        this.errorMessage = 'Có lỗi xảy ra trong quá trình tải dữ liệu.'; // Thông báo lỗi
      }
    );
  }

  openChat(room: any): void {
    this.selectedRoom = room; // Lưu phòng chat đã chọn
    this.nhantinService.getMessagesByRoomId(room.id).subscribe(
      // Sử dụng room.id
      (response) => {
        if (response.success) {
          this.selectedRoom.messages = response.data;
          console.log('list chat', response.data);
        } else {
          this.errorMessage = response.error;
        }
      },
      (error) => {
        this.errorMessage = 'Lỗi khi tải tin nhắn.'; // Thông báo lỗi
      }
    );
  }

  goBack(): void {
    this.selectedRoom = null; // Đặt selectedRoom về null để hiển thị lại danh sách phòng chat
  }
}
