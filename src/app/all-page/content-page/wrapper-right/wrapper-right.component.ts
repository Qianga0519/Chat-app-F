import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../service/dat/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../../../service/dat/auth.service';

@Component({
  selector: 'app-wrapper-right',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './wrapper-right.component.html',
  styleUrls: ['./wrapper-right.component.css'], 
  providers: [UsersService],
})
export class WrapperRightComponent implements OnInit {

  friends: any[] = [];
  userId: any = null; // Để lưu trữ userId
  isFriendsLoaded: boolean = false; // Biến kiểm soát trạng thái load danh sách bạn bè

  constructor(
    private router: Router, 
    private authService: AuthService,
    private userService: UsersService
  ) {}

  // Hàm lấy token từ localStorage và xác thực
  getUserIdFromToken() {
    this.authService.verifyToken().subscribe(
      (response) => {
        console.log('Phản hồi từ API:', response); // Kiểm tra phản hồi từ API
        if (response && response.success) {
          this.userId = response.userId; // Đảm bảo rằng userId từ API được gán đúng
          console.log('User ID lấy được:', this.userId); // In ra userId để kiểm tra
          this.loadFriends(); // Gọi hàm lấy bạn bè sau khi đã có userId
        } else {
          console.error('Lỗi: ', response.message); // In ra lỗi nếu có
        }
      },
      (error) => {
        console.error('Lỗi khi xác thực token:', error);
      }
    );
  }

  // Hàm lấy danh sách bạn bè
  loadFriends() {
    if (this.userId) {
      this.userService.getFriends(this.userId).subscribe(
        (data: any) => {
          this.isFriendsLoaded = true; // Đánh dấu đã load danh sách bạn bè
          if (Array.isArray(data)) {
            this.friends = data;
          } else {
            console.error('Dữ liệu trả về không phải là một mảng:', data);
            this.friends = []; // Gán giá trị rỗng để tránh lỗi *ngFor
          }
        },
        (error) => {
          console.error('Error fetching friends:', error); // Ghi lại thông báo lỗi
          this.isFriendsLoaded = true; // Đánh dấu là đã load (ngay cả khi có lỗi)
        }
      );
    }
  }

  ngOnInit(): void {
    this.getUserIdFromToken(); // Lấy userId khi khởi tạo component
  }
}
