import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { UserService } from '../service/quang/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router'; // Đảm bảo nhập Router từ @angular/router
import { AuthService } from '../service/quang/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, RouterLink],
providers: [UserService, AuthService],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  regis_success = false;
  regis_message = '';

  constructor(private userService: UserService, private router: Router, private authService:AuthService) {

    // Đảm bảo tiêm Router đúng cách
    this.registerForm = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern('^[A-Za-z0-9 ]+$'), // Cho phép khoảng trắng
        ]),
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
        rePassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    return control.get('password')?.value === control.get('rePassword')?.value
      ? null
      : { mismatch: true };
  }

  ngOnInit(): void {
  }

  register(event: Event) {
    event.preventDefault();
    if (this.registerForm.valid) {
      const userData = this.registerForm.value; // Lấy dữ liệu từ form
      this.userService.createUser(userData).subscribe((response) => {
        if (response.success == true) {
          this.showNotification();
          this.regis_message = response.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); // 3000ms = 3s
        } else {
          this.showNotification();
          this.regis_message = response.message;
        }
      });
    } else {
      this.showNotification();
      this.regis_message = 'Nhập thông tin!';
    }
  }
  showNotification() {
    this.regis_success = true;
    setTimeout(() => {
      this.regis_success = false;
    }, 5000);
  }

  closeNotification() {
    this.regis_success = false;
  }

}
