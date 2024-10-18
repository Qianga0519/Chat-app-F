import { Component } from '@angular/core';
import { UsersService } from '../../../service/dat/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-wrapper-right',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './wrapper-right.component.html',
  styleUrl: './wrapper-right.component.css',
  providers: [UsersService,],
})
export class WrapperRightComponent {

  friends: any[] = [];

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    const userId = 1; // Giả sử bạn đang đăng nhập với user ID = 1
    this.userService.getFriends(userId).subscribe(
      (data: any) => {
        this.friends = data;
      },
      (error) => {
        console.error('Error fetching friends:', error); // Ghi lại thông báo lỗi
      }
    );
  }
}