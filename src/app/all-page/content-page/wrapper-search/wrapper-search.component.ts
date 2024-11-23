import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../service/dat/user.service';
import { HeaderComponent } from '../../header/header.component';
import { WrapperLeftComponent } from '../wrapper-left/wrapper-left.component';
import { WrapperRightComponent } from '../wrapper-right/wrapper-right.component';
import { ModalEditPostComponent } from '../../modal-edit-post/modal-edit-post.component';
import { ModalCreatePostComponent } from '../../modal-create-post/modal-create-post.component';
import { FooterComponent } from '../../footer/footer.component';
import { PostService } from '../../../service/dat/post.service';
import { AuthService } from '../../../service/dat/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThichbaivietService } from '../../../service/thichbaiviet/thichbaiviet.service';
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
  currentUserId: any;
  selectedOrder: number = 1;
  selectedFrom: number = 3;
  userId: any;
  authToken: any;
  isLoading = false;
  noPosts = false;
  userLikePosts: any[] = [];
  userIdRouu: any;
  lastPostId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private postService: PostService,
    private authService: AuthService,
    private thichbaivietService: ThichbaivietService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('id_user'));
    this.authToken = String(localStorage.getItem('authToken'));
    if (!this.userId) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
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


  searchPost(): void {
    // Lấy token từ localStorage
    this.searchKeyword = this.cleanInput(this.searchKeyword);
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Không có token. Vui lòng đăng nhập lại.');
      alert('Vui lòng đăng nhập để tìm kiếm.');
      return; // Dừng lại nếu không có token
    }

    // Xác thực token để lấy userId
    this.authService.verifyToken().subscribe(
      (response) => {
        if (response.success) {
          this.currentUserId = response.userId; // Lấy userId từ phản hồi
          if (!this.searchKeyword) {
            alert('Vui lòng nhập từ khóa tìm kiếm.');
            return;
          }

          // Gọi searchPost từ service
          this.postService
            .searchPost(
              this.searchKeyword,
              this.selectedOrder,
              this.selectedFrom,
              this.currentUserId
            )
            .subscribe(
              (data) => {
                if (Array.isArray(data)) {
                  this.posts = data;
                  this.noUsersFound = this.posts.length === 0;
                } else {
                  this.posts = [];
                  this.noUsersFound = true;
                }
                // console.log('Kết quả tìm kiếm:', this.posts); // Log dữ liệu bài viết
              },
              (error) => {
                console.error('Có lỗi xảy ra khi tìm kiếm bài viết:', error);
                this.noUsersFound = true;
              }
            );
        } else {
          console.error('Lỗi xác thực token:', response.message);
          alert('Lỗi xác thực. Vui lòng đăng nhập lại.');
        }
      },
      (error) => {
        console.error('Lỗi khi xác thực token:', error);
        alert('Có lỗi xảy ra khi xác thực. Vui lòng thử lại.');
      }
    );
  }
  sharePost(postId: number) {
    this.postService.sharePost(postId, this.userId).subscribe(
      (shareResponse) => {
        console.log(this.userId);
        if (shareResponse.success) {
          //console.log('Chia sẻ bài viết thành công!');
          alert("Chia sẻ bài viết thành công!");
        
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

  loadPosts() {
    this.checkAuth();
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
          console.log(dataLike);

          const updatedPosts = data.map((post) => {
            post.liked = dataLike.includes(post.id);
            return post;
          });
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
    this.checkAuth();
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
        }
        console.log(response);
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
  cleanInput(input: string): string {
    return input.replace(/[<>/"'&]/g, ''); // Loại bỏ các ký tự đặc biệt
  }
  checkAuth() {
    this.authService.verifyToken().subscribe((response) => {
      if (response.success != true) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
  navigateToPostDetail(postId: number) {
    const userIdRouu = this.route.snapshot.params['id'];

    this.router
      .navigate([`/detail/${postId}`])
      .catch((error) => console.error('Lỗi khi điều hướng:', error));
  }
}
