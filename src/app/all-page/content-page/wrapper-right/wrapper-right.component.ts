import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../service/dat/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/dat/auth.service';
import { BlockUserService } from '../../../service/block_user/block_user.service';
import { Token } from '@angular/compiler';
import { response } from 'express';

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
  makeFriend: any[] = [];
  userId: any = null; // Để lưu trữ userId
  isFriendsLoaded: boolean = false; // Biến kiểm soát trạng thái load danh sách bạn bè
  message: any;
  authToken: string =
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken') ||
    '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UsersService,
    private blockUserService: BlockUserService
  ) {

  }

  blockUser(friend_id: any) {
    this.blockUserService
      .blockUserRequest(this.userId, friend_id, this.authToken)
      .subscribe((response) => {
        if (response) {
          // alert(response.message);
        } else {
          // alert(response.message);
        }
        console.log(response)
      });
  }
  // Hàm lấy token từ localStorage và xác thực
  getUserIdFromToken() {
    this.authService.verifyToken().subscribe(
      (response) => {
        if (response && response.success) {
          this.userId = response.userId; // Đảm bảo rằng userId từ API được gán đúng
          this.loadFriends();
          this.MakeFiend();
        } else {
          console.error('Lỗi: ', response.message); // In ra lỗi nếu có
        }
      },
      (error) => {
        console.error('Lỗi khi xác thực token:', error);
      }
    );
  }

  loadFriends() {
    if (this.userId) {
      this.userService.getFriends(this.userId).subscribe(
        (data: any) => {
          this.isFriendsLoaded = true; // Đánh dấu đã load danh sách bạn bè
          if (Array.isArray(data)) {
            this.friends = data;
            console.log(data);
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
  reloadFriendsList() {
    this.MakeFiend(); // Gọi lại phương thức để lấy danh sách bạn bè
    this.loadFriends();
  }

  MakeFiend() {
    if (this.userId) {
      this.userService.makeFriend(this.userId).subscribe(
        (data: any) => {
          this.isFriendsLoaded = true; // Đánh dấu đã load danh sách bạn bè
          if (Array.isArray(data)) {
            this.makeFriend = data;
          } else {
            // console.error('Dữ liệu trả về không phải là một mảng:', data);
            this.makeFriend = []; // Gán giá trị rỗng để tránh lỗi *ngFor
          }
        },
        (error) => {
          console.error('Error fetching friends:', error); // Ghi lại thông báo lỗi
          this.isFriendsLoaded = true; // Đánh dấu là đã load (ngay cả khi có lỗi)
        }
      );
    }
  }

  acceptFriend(friendId: number) {
    // Lấy token từ localStorage
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!token) {
      console.error('Không có token. Vui lòng đăng nhập lại.');
      return; // Dừng lại nếu không có token
    }

    // Xác thực token để lấy userId
    this.authService.verifyToken().subscribe(
      (response) => {
        if (response.success) {
          const userId1 = response.userId; // Lấy userId từ phản hồi

          this.userService.acceptFriendRequest(userId1, friendId).subscribe(
            (response) => {
              if (!response.error) {
                this.message = response.message;
                this.reloadFriendsList();
              } else {
                this.message = response.message;
              }
            },
            (error) => {
              console.error('Error accepting friend request', error);
            }
          );
        } else {
          console.error('Lỗi xác thực token:', response.message);
        }
      },
      (error) => {
        console.error('Lỗi khi xác thực token:', error);
      }
    );
  }

  declineFriend(friendId: number) {
    // Lấy token từ localStorage
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!token) {
      console.error('Không có token. Vui lòng đăng nhập lại.');
      return; // Dừng lại nếu không có token
    }

    // Xác thực token để lấy userId
    this.userService.verifyToken().subscribe(
      (response) => {
        if (response.success) {
          const userId1 = response.userId; // Lấy userId từ phản hồi

          this.userService.declineFriendRequest(userId1, friendId).subscribe(
            (response) => {
              if (!response.error) {
                this.message = response.message;
                this.updateFriendRequestUI(friendId); // Cập nhật UI sau khi từ chối
              } else {
                this.message = response.message;
              }
            },
            (error) => {
              console.error('Error declining friend request', error);
            }
          );
        } else {
          console.error('Lỗi xác thực token:', response.message);
        }
      },
      (error) => {
        console.error('Lỗi khi xác thực token:', error);
      }
    );
  }

  updateFriendRequestUI(friendId: number) {
    // Xóa yêu cầu kết bạn khỏi danh sách hiển thị mà không cần F5
    this.makeFriend = this.makeFriend.filter(
      (friend) => friend.id !== friendId
    );
  }
  ngOnInit(): void {
    this.getUserIdFromToken(); // Lấy userId khi khởi tạo component
  }
}
