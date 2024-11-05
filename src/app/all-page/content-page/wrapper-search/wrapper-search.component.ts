import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { UsersService } from '../../../service/dat/user.service';

// Các component được import
import { HeaderComponent } from '../../header/header.component';
import { WrapperLeftComponent } from '../wrapper-left/wrapper-left.component';
import { WrapperRightComponent } from '../wrapper-right/wrapper-right.component';
import { ModalEditPostComponent } from '../../modal-edit-post/modal-edit-post.component';
import { ModalCreatePostComponent } from '../../modal-create-post/modal-create-post.component';
import { FooterComponent } from '../../footer/footer.component';
import { PostService } from '../../../service/dat/post.service';
import { AuthService } from '../../../service/dat/auth.service';

@Component({
  selector: 'app-wrapper-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    WrapperLeftComponent,
    WrapperRightComponent,
    ModalEditPostComponent,
    ModalCreatePostComponent,
    FooterComponent,
  ],
  templateUrl: './wrapper-search.component.html',
  styleUrls: ['./wrapper-search.component.css'],
})
export class WrapperSearchComponent implements OnInit {
  users: any[] = [];
  searchKeyword: string = ''; // Biến lưu trữ từ khóa tìm kiếm
  message: string = ''; // Biến lưu trữ thông báo
  noUsersFound: boolean = false;
  posts: any[] = [];
  currentUserId: any;
  selectedOrder: number = 1;
  selectedFrom: number = 3;
  constructor(
    private userService: UsersService,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
  showUsers: boolean = true;
  showPosts: boolean = false;
  searchUsers(keyword: string): void {
    this.userService.searchUsers(keyword).subscribe(
      (data) => {
        // console.log('Dữ liệu người dùng:', data);
        if (Array.isArray(data)) {
          this.users = data; // Lưu dữ liệu người dùng
          this.noUsersFound = this.users.length === 0;
        } else {
          // console.error('Dữ liệu trả về không phải là mảng:', data);
          this.users = [];
          this.noUsersFound = true;
        }
      },
      (error) => {
        // console.error('Có lỗi xảy ra!', error);
        this.noUsersFound = true;
      }
    );
  }
//   searchPost(): void {
//     // Lấy token từ localStorage
//     const token = localStorage.getItem('authToken');

//     if (!token) {
//         console.error('Không có token. Vui lòng đăng nhập lại.');
//         alert("Vui lòng đăng nhập để tìm kiếm.");
//         return; // Dừng lại nếu không có token
//     }

//     // Xác thực token để lấy userId
//     this.authService.verifyToken().subscribe(
//         (response) => {
//             if (response.success) {
//                 this.currentUserId = response.userId; // Lấy userId từ phản hồi
//               console
//                 if (!this.searchKeyword) {
//                     alert("Vui lòng nhập từ khóa tìm kiếm.");
//                     return;
//                 }

//                 this.postService.searchPost(this.searchKeyword, this.selectedOrder, this.selectedFrom, this.currentUserId).subscribe(
//                     (data) => {
//                         if (Array.isArray(data)) {
//                             this.posts = data;
//                             this.noUsersFound = this.posts.length === 0;
//                         } else {
//                             this.posts = [];
//                             this.noUsersFound = true;
//                         }
//                     },
//                     (error) => {
//                         console.error('Có lỗi xảy ra!', error);
//                         this.noUsersFound = true;
//                     }
//                 );
//             } else {
//                 console.error('Lỗi xác thực token:', response.message);
//                 alert("Lỗi xác thực. Vui lòng đăng nhập lại.");
//             }
//         },
//         (error) => {
//             console.error('Lỗi khi xác thực token:', error);
//             alert("Có lỗi xảy ra khi xác thực. Vui lòng thử lại.");
//         }
//     );
// }

searchPost(): void {
  // Lấy token từ localStorage
  const token = localStorage.getItem('authToken');

  if (!token) {
      console.error('Không có token. Vui lòng đăng nhập lại.');
      alert("Vui lòng đăng nhập để tìm kiếm.");
      return; // Dừng lại nếu không có token
  }

  // Xác thực token để lấy userId
  this.authService.verifyToken().subscribe(
      (response) => {
          if (response.success) {
              this.currentUserId = response.userId; // Lấy userId từ phản hồi
              console.log('User ID xác thực:', this.currentUserId); // In ra để kiểm tra

              if (!this.searchKeyword) {
                  alert("Vui lòng nhập từ khóa tìm kiếm.");
                  return;
              }

              // Gọi searchPost từ service
              this.postService.searchPost(
                  this.searchKeyword, 
                  this.selectedOrder, 
                  this.selectedFrom, 
                  this.currentUserId
              ).subscribe(
                  (data) => {
                      if (Array.isArray(data)) {
                          this.posts = data;
                          this.noUsersFound = this.posts.length === 0;
                      } else {
                          this.posts = [];
                          this.noUsersFound = true;
                      }
                      console.log('Kết quả tìm kiếm:', this.posts); // Log dữ liệu bài viết
                  },
                  (error) => {
                      console.error('Có lỗi xảy ra khi tìm kiếm bài viết:', error);
                      this.noUsersFound = true;
                  }
              );
          } else {
              console.error('Lỗi xác thực token:', response.message);
              alert("Lỗi xác thực. Vui lòng đăng nhập lại.");
          }
      },
      (error) => {
          console.error('Lỗi khi xác thực token:', error);
          alert("Có lỗi xảy ra khi xác thực. Vui lòng thử lại.");
      }
  );
}

}
