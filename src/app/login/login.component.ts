import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../service/quang/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  login_success = false;
  login_message = '';
  isLogin = false;

  constructor(private authService: AuthService, private router: Router) {
    // Đảm bảo tiêm Router đúng cách
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(
          '^(?!\\.)(?!.*\\.{2})[A-Za-z0-9\\.]+(?<!\\.)@gmail\\.com$'
        ), // Regex cho email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$'), // Regex cho mật khẩu
      ]),
    });
  }
  ngOnInit(): void {}

  login(event: Event) {
    event.preventDefault();
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response) => {
          if (response.success == true) {
            console.log(response.token);
            this.isLogin = true;
          } else {
            this.showNotification(response.message);
          }
        },
        (error) => {
          console.error('Lỗi đăng nhập:', error);
        }
      );
    } else {
      this.showNotification('Nhập thông tin!');
    }
  }
  showNotification(message: any) {
    this.login_success = true;
    this.login_message = message;
    setTimeout(() => {
      this.login_success = false;
    }, 5000);
  }
  closeNotification() {
    this.login_success = false;
  }
}
