import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AllPageComponent } from './all-page/all-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './service/quang/auth.service';
import { UserService } from './service/quang/user.service';
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

  constructor(
    private authService: AuthService,
    private user: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout().subscribe((response) => {
      if (response.success) {
        this.router.navigate(['/login']);
      }
    });
  }

  // @HostListener('window:beforeunload', ['$event'])
  // handleBeforeUnload(event: BeforeUnloadEvent) {
  //   const token =
  //     sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

  //   if (token) {
  //     const data = JSON.stringify({ token });
  //     const blob = new Blob([data], { type: 'application/json' });

  //     console.log('Gửi yêu cầu đến server với token:', token);

  //     const isSent = navigator.sendBeacon(
  //       'http://localhost:8080/chat_api/quangApi/auth/updateStatus.php',
  //       blob
  //     );

  //     console.log('Yêu cầu gửi thành công:', isSent);

  //     // Thiết lập returnValue để trình duyệt biết rằng có một hành động đang xảy ra
  //     event.returnValue = 'Are you sure you want to leave?';
  //   }
  // }
}
