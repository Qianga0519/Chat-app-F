import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AllPageComponent } from './all-page/all-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './service/quang/auth.service';

import { response } from 'express';
import { UserService } from './service/quang/user.service';
import { error } from 'console';
import { AuthGuard } from './auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RegisterComponent,
    LoginComponent,
    AllPageComponent,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  providers: [AuthService, UserService, AuthGuard],
})
export class AppComponent implements OnInit {
  title = 'chat-app';
  $is_login = false;
  constructor(private authService: AuthService, private user: UserService) {}
  ngOnInit(): void {
    // this.authService.verifyToken().subscribe({
    //   next: (response) => {
    //     // Xử lý phản hồi thành công
    //     if (response.success == true) {
    //       console.log('Token hợp lệ:', response);      
    //     } else {
    //       console.log('Token không hợp lệ');
    //       // Xử lý khi token không hợp lệ
    //     }
    //   },
    //   error: (error) => {
    //     // Xử lý lỗi từ server
    //     console.error('Lỗi kiểm tra token:', error);
    //     // Có thể hiển thị thông báo lỗi cho người dùng
    //   },
    // });
  }
  logout() {
    this.authService.logout();
  }
}
