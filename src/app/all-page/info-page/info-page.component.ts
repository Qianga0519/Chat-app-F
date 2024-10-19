import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ModalEditPostComponent } from "../modal-edit-post/modal-edit-post.component";
import { ModalCreatePostComponent } from "../modal-create-post/modal-create-post.component";
import { UsersService } from '../../service/dat/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ModalEditPostComponent,
    ModalCreatePostComponent,
    HttpClientModule,
    ReactiveFormsModule
  ],
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css'],
  providers: [UsersService]
})
export class InfoPageComponent implements OnInit {

  user: any;
  profileForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: [''],
      gender: [''],
      phone: ['']
    });
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.checkTokenAndFetchUserInfo(userId);
  }

  // Kiểm tra token và lấy thông tin người dùng
  checkTokenAndFetchUserInfo(userId: number) {
    this.usersService.verifyToken().subscribe(
      (tokenResponse) => {
        if (tokenResponse.success) {
          const tokenUserId = tokenResponse.userId; // Giả sử server trả về userId từ token
          if (tokenUserId === userId) { // Kiểm tra xem userId từ token có khớp không
            this.usersService.getUserInfoByUserIdtest(userId).subscribe(
              (data) => {
                this.user = data;
                this.initProfileForm();
              },
              (error) => {
                console.error('Error fetching user info:', error);
              }
            );
          } else {
            alert('Bạn không có quyền truy cập vào thông tin này.');
          }
        } else {
          alert('Token không hợp lệ. Bạn không thể cập nhật thông tin.');
        }
      },
      (error) => {
        console.error('Error verifying token:', error);
        alert('Có lỗi xảy ra khi xác thực token.');
      }
    );
  }

  initProfileForm() {
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        age: this.user.age,
        gender: this.user.gender,
        phone: this.user.phone
      });
    }
  }

  updateProfile() {
    const userData = this.profileForm.value;
    const userId = this.user.id;

    this.usersService.verifyToken().subscribe(
      (tokenResponse) => {
        if (tokenResponse.success) {
          const tokenUserId = tokenResponse.userId; // Giả sử server trả về userId từ token
          if (tokenUserId === userId) { // Kiểm tra ID
            this.usersService.updateUserInfo(userId, userData).subscribe(
              (response) => {
                if (response.error) {
                  alert(response.message);
                } else {
                  alert(response.message);
                  this.user.name = userData.name;
                  this.user.age = userData.age;
                  this.user.gender = userData.gender;
                  this.user.phone = userData.phone;
                  this.initProfileForm();
                }
              },
              (error) => {
                console.error('Cập nhật thất bại', error);
                alert('Có lỗi xảy ra. Vui lòng thử lại!');
              }
            );
          } else {
            alert('Bạn không có quyền cập nhật thông tin này.');
          }
        } else {
          alert('Token không hợp lệ. Bạn không thể cập nhật thông tin.');
        }
      },
      (error) => {
        console.error('Error verifying token:', error);
        alert('Có lỗi xảy ra khi xác thực token.');
      }
    );
  }
}