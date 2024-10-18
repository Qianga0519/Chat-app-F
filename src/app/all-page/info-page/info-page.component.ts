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
      name: ['', Validators.required], // Thêm validators nếu cần
      age: [''],
      gender: [''],
      phone: ['']
    });
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.usersService.getUserInfoByUserIdtest(userId).subscribe(
      (data) => {
        this.user = data;
        this.initProfileForm(); // Khởi tạo form với dữ liệu người dùng
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }

  initProfileForm() {
    if (this.user) {
      // Điền dữ liệu vào form từ thông tin người dùng
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

    this.usersService.updateUserInfo(userId, userData).subscribe(
      (response) => {
        if (response.error) {
          alert(response.message);
        } else {
          alert(response.message);
          // Cập nhật thông tin người dùng với dữ liệu mới
          this.user.name = userData.name;
          this.user.age = userData.age;
          this.user.gender = userData.gender;
          this.user.phone = userData.phone;

          // Cập nhật form với dữ liệu mới
          this.initProfileForm(); 
        }
      },
      (error) => {
        console.error('Cập nhật thất bại', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    );
}}