import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ModalEditPostComponent } from '../modal-edit-post/modal-edit-post.component';
import { ModalCreatePostComponent } from '../modal-create-post/modal-create-post.component';
import { ApiResponse, UsersService } from '../../service/dat/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../service/dat/post.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AuthService } from '../../service/quang/auth.service';
import { ThichbaivietService } from '../../service/thichbaiviet/thichbaiviet.service';
import { response } from 'express';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ModalEditPostComponent,
    ModalCreatePostComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css'],
  providers: [UsersService, AuthService],
})
export class InfoPageComponent implements OnInit {
  user: any;
  profileForm: FormGroup;
  isOwner: boolean = false; // Biến để kiểm tra xem đây có phải trang cá nhân của chính người dùng không
  posts: any[] = [];
  idpost: any;
  posta: any;
  avatar: any;
  oldPassword: string = '';
  newPassword: string = '';
  repeatNewPassword: string = '';
  oldPasswordError: string = '';
  newPasswordError: string = '';
  repeatPasswordError: string = '';
  userId: any;
  authToken: string;
  userLikePosts: any[] = [];
  isLoading = false;
  noPosts = false;
  lastPostId = 0;
  userIdRouu: any;
  isFriend: boolean = false;
  errorMessage: string = '';
   message: string = '';
   path_meida = 'http://localhost:8080/chat_api/uploads'
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private auth: AuthService,
    private router: Router,
    private authService: AuthService,
    private thichbaivietService: ThichbaivietService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, nameValidator()]],
      age: ['', [Validators.required, ageValidator()]],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, phoneValidator([])]],
    });
    this.userId = Number(
      localStorage.getItem('id_user') || sessionStorage.getItem('id_user')
    );
    this.authToken = String(
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    );
    if (!this.userId) {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
    this.userIdRouu = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.checkTokenAndFetchUserInfo(userId);

    const id = this.route.snapshot.params['id']; // Lấy ID từ route
    this.AvatarByUser(id);
    this.loadPosts();

    const ids = Number(this.route.snapshot.paramMap.get('id'));
    // console.log(ids);
    this.postService.kiemTraID(ids).subscribe(
      (response) => {
        if (response.success) {
          // Xử lý bài viết
        } else {
          this.router.navigate(['/404']); // Chuyển hướng nếu không tìm thấy bài viết
        }
      },
      (error) => {
        this.router.navigate(['/']); // Chuyển hướng nếu lỗi kết nối
      }
    );
    this.checkFriendshipStatus(userId);
  }

  onLogout() {
    this.auth.logout().subscribe((response) => {
      if(response.success){
        this.router.navigate(['/login'])
      }
    });
  }

  checkFriendshipStatus(friendId: number) {
    const userIds = Number(localStorage.getItem('id_user')|| sessionStorage.getItem('id_user'));
    this.usersService.checkFriendshipStatus(userIds, friendId).subscribe(
      (response: { isFriend: boolean }) => {
        this.isFriend = response.isFriend; // Cập nhật trạng thái bạn bè
      },
      (error) => {
        this.errorMessage = 'Có lỗi xảy ra khi kiểm tra tình trạng bạn bè.';
        console.error('Lỗi khi kiểm tra tình trạng bạn bè', error);
      }
    );
  }

  sendRequest() {
    const friendId = this.route.snapshot.params['id'];
    this.usersService.sendFriendRequest(this.userId, friendId).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.message = response.message;
        } else {
          this.message = response.message;
        }
      },
      (error) => {
        this.message = 'Có lỗi xảy ra, vui lòng thử lại.';
      }
    );
  }
  cancelFriendship() {
    const friendId = this.route.snapshot.params['id'];
    this.usersService.cancelFriendship(this.userId, friendId).subscribe(response => {
      if (response.status === 'success') {
        alert(response.message); // Thông báo thành công
        window.location.reload();
      } else {
        alert(response.message); // Thông báo lỗi
      }
    }, error => {
      console.error('Có lỗi xảy ra:', error);
      alert('Có lỗi xảy ra khi hủy kết bạn');
    });
  }
  loadPosts() {
    if (!this.isLoading) {
      this.isLoading = true;

      // Lấy danh sách các bài viết đã được like bởi người dùng
      this.thichbaivietService
        .getUserLikePost(this.userId)
        .subscribe((response) => {
          if (response.success == true) {
            this.userLikePosts = response.data;
          }
        });

      // Lấy danh sách bài viết
      this.postService.postbyid(this.userIdRouu).subscribe(
        (data: any[]) => {
          // Cập nhật bài viết với trạng thái liked
          const dataLike = this.userLikePosts.map((like) => like.post_id);
          // console.log(dataLike);

          const updatedPosts = data.map((post) => {
            post.liked = dataLike.includes(post.id);
            return post;
          });

          // console.log(updatedPosts);

          // Cập nhật danh sách bài viết với các bài viết mới
          this.posts = [...this.posts, ...updatedPosts];

          if (data.length > 0) {
            this.lastPostId = data[data.length - 1].id;
            this.noPosts = false;
          } else {
            this.noPosts = true;
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Lỗi khi tải bài viết:', error);
          this.isLoading = false;
        }
      );
    }
  }

  likePostId(post_id: number) {
    const data: any = {
      post_id: post_id,
      user_id: this.userId,
      authToken: this.authToken,
    };
    this.thichbaivietService.createPostLikeByPostId(data).subscribe(
      (response) => {
        if (response.success) {
          // Cập nhật số lượng likes trực tiếp
          const post = this.posts.find((p) => p.id === post_id);
          if (post) {
            if (response.like == 1) {
              post.total_likes = (parseInt(post.total_likes) || 0) + 1;

              this.updatePostLikedStatus(post_id, true);
            } else {
              post.total_likes = (parseInt(post.total_likes) || 0) - 1;
              this.updatePostLikedStatus(post_id, false);
            }
          }
          this.updateLikesCount(post_id);
          // console.log(this.updateLikesCount(post_id));
        }
        // console.log(response);
      },
      (error) => {
        console.error('Error liking post:', error);
      }
    );
  }
  updatePostLikedStatus(postId: number, liked: boolean) {
    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      post.liked = liked; // Cập nhật trạng thái liked
    }
  }
  updateLikesCount(postId: number) {
    this.thichbaivietService.getLikesCount(postId).subscribe((response) => {
      if (response.success) {
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          post.total_likes = response.data.like_count; // Cập nhật số lượng likes
          // console.log(response)
        }
      }
    });
  }


  navigateToPostDetail(postId: number) {
    this.router
      .navigate([`/detail/${postId}`])
      .catch((error) => console.error('Lỗi khi điều hướng:', error));
  }
  checkTokenAndFetchUserInfo(userId: number) {
    this.usersService.verifyToken().subscribe(
      (tokenResponse) => {
        if (tokenResponse.success) {
          const tokenUserId = tokenResponse.userId; // Giả sử server trả về userId từ token
          // console.log("tokenid",typeof tokenUserId);
          // console.log("userId",typeof userId);
          if (tokenUserId == userId) {
            this.isOwner = true; // Token và userId khớp, người dùng có thể chỉnh sửa thông tin
          } else {
            this.isOwner = false; // Người dùng đang xem trang của người khác, ẩn chức năng chỉnh sửa
          }
          // Lấy thông tin của user để hiển thị
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
          alert('Token không hợp lệ. Bạn không thể truy cập thông tin.');
          // Điều hướng về trang đăng nhập hoặc thông báo lỗi
        }
      },
      (error) => {
        console.error('Error verifying token:', error);
        alert('Có lỗi xảy ra khi xác thực token.');
      }
    );
  }

  sharePost(postId: number) {
    this.postService.sharePost(postId, this.userId).subscribe(
      (shareResponse) => {
        // console.log(this.userId);
        if (shareResponse.success) {
          console.log('Chia sẻ bài viết thành công!');
          //alert("Chia sẻ bài viết thành công!");
          this.loadPosts1();
        } else {
          console.error('Lỗi chia sẻ bài viết:', shareResponse.message);
          alert('Có lỗi xảy ra khi chia sẻ bài viết.');
        }
      },
      (error) => {
        console.error('Có lỗi xảy ra khi chia sẻ bài viết:', error);
      }
    );
  }

  // Hàm để load lại dữ liệu (tự bạn định nghĩa theo yêu cầu)
  loadPosts1() {
    this.postService.postbyid(this.userId).subscribe((posts) => {
      this.posts = posts;
    });
  }

  initProfileForm() {
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        age: this.user.age,
        gender: this.user.gender,
        phone: this.user.phone,
      });
    }
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return; // Không thực hiện cập nhật nếu form không hợp lệ
    }
    const userData = this.profileForm.value;
    const userId = this.user.id;

    if (!this.isOwner) {
      alert('Bạn không có quyền cập nhật thông tin này.');
      return;
    }

    this.usersService.verifyToken().subscribe(
      (tokenResponse) => {
        if (tokenResponse.success) {
          const tokenUserId = tokenResponse.userId;
          if (tokenUserId === userId) {
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

  AvatarByUser(IdAvatar: number): void {
    this.usersService.IsAvatarByUser(IdAvatar).subscribe(
      (data) => {
        this.avatar = data;
      },
      (error) => {
        console.error('Error fetching user posts:', error);
      }
    );
  }

  changePassword() {
    this.oldPasswordError = ''; // Reset thông báo lỗi

    // Kiểm tra mật khẩu cũ
    if (!this.verifyOldPassword(this.oldPassword)) {
      // Giả sử bạn có hàm verifyOldPassword để kiểm tra
      this.oldPasswordError = 'Sai mật khẩu cũ.';
      return; // Dừng lại nếu mật khẩu cũ không đúng
    }

    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có khớp nhau không
    if (this.newPassword !== this.repeatNewPassword) {
      alert(
        'Mật khẩu xác nhận không khớp với mật khẩu mới. Vui lòng kiểm tra lại!'
      );
      return; // Dừng lại nếu mật khẩu không khớp
    }

    const payload = {
      user_id: this.user.id,
      old_password: this.oldPassword,
      new_password: this.newPassword,
    };

    this.usersService.changePassword(payload).subscribe(
      (response: ApiResponse) => {
        if (response.error) {
          alert(response.message);
        } else {
          alert('Mật khẩu đã được thay đổi thành công!');
          // Xóa các trường nhập sau khi đổi mật khẩu thành công
          this.oldPassword = '';
          this.newPassword = '';
          this.repeatNewPassword = '';
        }
      },
      (error) => {
        console.error('Đã xảy ra lỗi:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    );
  }

  // Hàm kiểm tra mật khẩu cũ (cần thực hiện gọi API hoặc kiểm tra giá trị)
  private verifyOldPassword(inputPassword: string): boolean {
    // Kiểm tra mật khẩu cũ với API hoặc từ dữ liệu đã lưu
    return true; // Thay đổi thành logic thực tế của bạn
  }

  validateNewPassword() {
    this.newPasswordError = ''; // Reset thông báo lỗi

    // Kiểm tra độ dài của mật khẩu mới
    if (this.newPassword.length < 6 || this.newPassword.length > 25) {
      this.newPasswordError = 'Độ dài password phải từ 6 đến 25 ký tự';
      return;
    }

    // Kiểm tra mật khẩu mới có chứa ký tự số, chữ hoa và chữ thường không
    if (!this.validatePassword(this.newPassword)) {
      this.newPasswordError = 'Password phải có chữ Hoa và thường và ký tự số';
      return;
    }

    // Kiểm tra xem mật khẩu mới có khoảng trống không
    if (this.newPassword.includes(' ')) {
      this.newPasswordError = 'Mật khẩu không được chứa khoảng trống.';
      return;
    }
  }

  validateRepeatPassword() {
    this.repeatPasswordError = ''; // Reset thông báo lỗi

    // Kiểm tra xem mật khẩu xác nhận có giống với mật khẩu mới không
    if (this.repeatNewPassword !== this.newPassword) {
      this.repeatPasswordError =
        'Mật khẩu xác nhận không khớp với mật khẩu mới. Vui lòng kiểm tra lại!';
      return;
    }
  }
  formatDate(dateString: string): string {
    if (dateString === '0000-00-00 00:00:00') {
      return 'Không có thông tin'; // Hoặc giá trị mặc định khác
    }
    return new Date(dateString).toLocaleString(); // Hoặc sử dụng Pipe khác
  }
  // Phương thức kiểm tra tính hợp lệ của mật khẩu
  private validatePassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return regex.test(password);
  }
}

function nameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value;
    const regex =
      /^(?=.*[A-Za-z])(?! )(?!.* {2})[A-Za-z0-9]+( [A-Za-z0-9]+)*(?<! )$/;
    if (!name || name.trim() === '') {
      return { invalidInput: true };
    }

    if (name.length > 30) {
      return { maxLength: true };
    }

    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialChars.test(name)) {
      return { specialChars: true };
    }

    if (!regex.test(name)) {
      return { invalidFormat: true };
    }

    return null;
  };
}

function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;

    if (age === '' || isNaN(age) || age < 16 || age > 100) {
      return { ageInvalid: true }; // Không hợp lệ
    }

    return null;
  };
}

function phoneValidator(existingPhones: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phone = control.value;
    const regex = /^[0-9]{10}$/;

    if (phone === '' || isNaN(phone)) {
      return { invalidInput: true };
    }

    if (!regex.test(phone)) {
      return { phoneInvalid: true };
    }

    if (existingPhones.includes(phone)) {
      return { phoneExists: true };
    }

    return null;
  };
}
