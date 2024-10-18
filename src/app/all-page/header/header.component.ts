import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../service/dat/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
 
})
export class HeaderComponent  {
  userId: any = '1'; // Ví dụ ID, bạn có thể thay đổi theo cách bạn muốn

  constructor(private router: Router) {}

  goToUserDetail() {
    this.router.navigate(['/user', this.userId]); // Điều hướng đến trang chi tiết người dùng
  }
}