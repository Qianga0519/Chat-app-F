import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { WrapperRightComponent } from '../wrapper-right/wrapper-right.component';
import { WrapperLeftComponent } from '../wrapper-left/wrapper-left.component';
import { ModalEditPostComponent } from '../../modal-edit-post/modal-edit-post.component';
import { ModalCreatePostComponent } from '../../modal-create-post/modal-create-post.component';
import { FooterComponent } from '../../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { DanhsachbaivietService } from '../../../service/dsbaiviet/danhsachbaiviet.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ThichbaivietService } from '../../../service/thichbaiviet/thichbaiviet.service';
import { response } from 'express';
import { AuthService } from '../../../service/quang/auth.service';
@Component({
  selector: 'app-wrapper-list-post',
  standalone: true,
  imports: [
    HttpClientModule,
    HeaderComponent,
    WrapperRightComponent,
    WrapperLeftComponent,
    ModalEditPostComponent,
    ModalCreatePostComponent,
    FooterComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './wrapper-list-post.component.html',
  providers: [DanhsachbaivietService],
})
export class WrapperListPostComponent implements OnInit {
  posts: any[] = [];
  lastPostId = 0; // ID bài viết cuối cùng của lô hiện tại
  limit = 5; // Số lượng bài viết mỗi lần tải
  isLoading = false;
  noPosts = false;
  userId: number;
  authToken: string;
  userLikePosts: any[] = [];

  toggleSeeMore(post: any) {
    post.showFullContent = !post.showFullContent;
  }
  constructor(
    private listPostService: DanhsachbaivietService,
    private router: Router,
    private thichbaivietService: ThichbaivietService,
    private authService: AuthService
  ) {
    this.userId = Number(localStorage.getItem('id_user'));
    this.authToken = String(localStorage.getItem('authToken'));
    if (!this.userId) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loadPosts(); // Tải bài viết ban đầu
    window.addEventListener('scroll', this.onScroll.bind(this)); // Lắng nghe sự kiện cuộn
    this.checkAuth();
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
    this.clearData;
  }
  clearData() {
    this.posts = [];
    this.lastPostId = 0;
    this.isLoading = false;
    this.noPosts = false;
    this.userLikePosts = [];
    // Reset các biến dữ liệu khác nếu cần
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
      this.listPostService.getPosts(this.lastPostId, this.limit).subscribe(
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
    this.router.navigate(['/detail', postId]);
  }

  onScroll() {
    // Kiểm tra nếu đang tải
    if (this.isLoading) return;

    // Kiểm tra xem đã cuộn đến đáy trang chưa
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 50; // Có thể điều chỉnh ngưỡng này nếu cần

    if (scrollPosition >= threshold) {
      this.loadPosts(); // Tải thêm bài viết
    }
  }
  formatDate(dateString: string): string {
    if (dateString === '0000-00-00 00:00:00') {
      return 'Không có thông tin'; // Hoặc giá trị mặc định khác
    }
    return new Date(dateString).toLocaleString(); // Hoặc sử dụng Pipe khác
  }
  checkAuth() {
    this.authService.verifyToken().subscribe((response) => {
      if (response.success != true) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
