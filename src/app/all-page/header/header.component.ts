import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../service/dat/user.service';
import { AuthService } from '../../service/dat/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  userId: any = null; // Để lưu trữ userId

  constructor(private router: Router, private authService: AuthService) {}

  // Hàm lấy token từ localStorage và xác thực
  getUserIdFromToken() {
    this.authService.verifyToken().subscribe(
      (response) => {
        if (response && response.success) {
          this.userId = response.userId; // Đảm bảo rằng userId từ API được gán đúng
        } else {
          console.error('Lỗi: ', response.message); // In ra lỗi nếu có
        }
      },
      (error) => {
        console.error('Lỗi khi xác thực token:', error);
      }
    );
  }

  // Hàm điều hướng khi đã có userId
  goToUserDetail() {
    if (this.userId) {
      this.router.navigate(['/user', this.userId]); // Điều hướng đến trang cá nhân
    } else {
      console.error('Không có userId để điều hướng');
    }
  }

  // Gọi hàm này khi component được khởi tạo
  ngOnInit() {
    this.getUserIdFromToken(); // Gọi hàm xác thực khi component được khởi tạo
  }
}
