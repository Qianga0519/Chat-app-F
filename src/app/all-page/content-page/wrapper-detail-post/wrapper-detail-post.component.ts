import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BvBlService } from '../../../service/baiviet_binhluan/bv-bl.service';
import { shareReplay, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { ModalCreatePostComponent } from '../../modal-create-post/modal-create-post.component';
import { ModalEditPostComponent } from '../../modal-edit-post/modal-edit-post.component';
import { WrapperLeftComponent } from '../wrapper-left/wrapper-left.component';
import { WrapperRightComponent } from '../wrapper-right/wrapper-right.component';
import { response } from 'express';
import { ThichbaivietService } from '../../../service/thichbaiviet/thichbaiviet.service';

@Component({
  selector: 'app-wrapper-detail-post',
  standalone: true,
  templateUrl: './wrapper-detail-post.component.html',
  imports: [
    HttpClientModule,
    HeaderComponent,
    WrapperRightComponent,
    WrapperLeftComponent,
    ModalEditPostComponent,
    ModalCreatePostComponent,
    FooterComponent,
    RouterModule,
    CommonModule,
    FormsModule,
  ],
})
export class WrapperDetailPostComponent implements OnInit, OnDestroy {
  post_id: any;
  post: any = {};
  post_like: any;
  post_share: any;
  post_comment: any;
  private subscription: Subscription | undefined;
  avatar_user_post: string = '';
  user_is_liked: boolean = false;
  userId: any;
  authToken: string;
  list_comment_post: any = [];
  constructor(
    private ativeRoute: ActivatedRoute,
    private router: Router,
    private baivietBinhluanService: BvBlService,
    private thichbaivietService: ThichbaivietService
  ) {
    this.userId = Number(sessionStorage.getItem('id_user') || localStorage.getItem('id_user'));
    this.authToken = String(sessionStorage.getItem('authToken') || localStorage.getItem('authToken'));
    if (!this.userId) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    // Theo dõi sự thay đổi của paramMap
    this.subscription = this.ativeRoute.paramMap.subscribe((paramMap) => {
      const newPostId = paramMap.get('id');
      if (newPostId !== this.post_id) {
        this.post_id = newPostId; // Cập nhật post_id mới
        this.scrollToTopAndLoadPost();
      }
      this.checkUserLike(newPostId);
    });
  }

  loadPost(): void {
    if (this.post_id) {
      this.baivietBinhluanService
        .getPostById(this.post_id)
        .pipe(shareReplay(1))
        .subscribe(
          (response: any) => {
            if (response.success) {
              this.post = response.data;
              this.loadAvataUserPost(this.post.user_id);
              this.updatePost(this.post.id);
              this.loadCommentPost(this.post.id);
            } else {
              alert(response.message);
              this.router.navigate(['/']);
            }
          },
          (error) => {
            console.error('Lỗi khi gọi API:', error);
            this.router.navigate(['/']);
          }
        );
    }
  }
  loadAvataUserPost(user_id: any) {
    this.baivietBinhluanService
      .getAvatarUser(user_id)
      .subscribe((response: any) => {
        this.avatar_user_post = response.data[0].url;
      });
  }

  loadCommentPost(post_id: number) {
    this.baivietBinhluanService
      .getListCommentPost(post_id)
      .subscribe((response: any) => {
        if (response.success) {
          this.list_comment_post = response.data;
        }
      });
  }

  checkUserLike(post_id: any) {
    this.baivietBinhluanService
      .checkUserLikePost(this.userId, post_id)
      .subscribe((response: any) => {
        if (response.success && response.status) {
          this.user_is_liked = true;
        } else {
          this.user_is_liked = false;
        }
      });
  }
  updatePost(post_id: any) {
    this.baivietBinhluanService
      .getUpdatePost(post_id)
      .subscribe((response: any) => {
        if (response.success) {
          this.post_like = response.data.like_count;
          this.post_share = response.data.share_count;
          this.post_comment = response.data.comment_count;
        }
      });
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
          if (response.like) {
            this.user_is_liked = true;
          } else {
            this.user_is_liked = false;
          }
        }
        this.updatePost(post_id);
      },
      (error) => {
        console.error('Error liking post:', error);
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe(); // Sử dụng optional chaining
  }

  formatDate(dateString: string): string {
    return dateString === '0000-00-00 00:00:00'
      ? 'Không có thông tin'
      : new Date(dateString).toLocaleString();
  }

  toggleSeeMore(post: any): void {
    post.showFullContent = !post.showFullContent;
  }

  commentText: string = '';

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  submitComment(): void {
    if (this.commentText.trim()) {
      console.log('Nội dung bình luận:', this.commentText);
      this.commentText = '';
    }
  }
  scrollToTopAndLoadPost(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
    this.loadPost(); // Gọi hàm loadPost để tải dữ liệu mới
  }
}
