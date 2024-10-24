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
  constructor(
    private userService: UsersService,
    private postService: PostService
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
  searchPost(keyword: string): void {
    this.postService.searchPost(keyword).subscribe(
      (data) => {
        // console.log('Dữ liệu người dùng:', data);
        if (Array.isArray(data)) {
          this.posts = data; // Lưu dữ liệu người dùng
          this.noUsersFound = this.posts.length === 0;
        } else {
          // console.error('Dữ liệu trả về không phải là mảng:', data);
          this.posts = [];
          this.noUsersFound = true;
        }
      },
      (error) => {
        // console.error('Có lỗi xảy ra!', error);
        this.noUsersFound = true;
      }
    );
  }
}
