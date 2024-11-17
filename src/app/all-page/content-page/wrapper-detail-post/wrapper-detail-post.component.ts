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
import { ThichbaivietService } from '../../../service/thichbaiviet/thichbaiviet.service';
import { PostService } from '../../../service/dat/post.service';
import { WebSocketService } from '../../../service/nhantin/websocket.service';
import { take } from 'rxjs/operators';
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
  path_media = 'http://localhost:8080/chat_api/uploads';
  post_comment: any;
  private subscription: Subscription | undefined;
  avatar_user_post: string = '';
  user_is_liked: boolean = false;
  userId: any;
  authToken: string;
  list_comment_post: any = [];
  userCmtId: any;
  content: string = '';
  order: number = 1;
  message: string = '';
  postId: any;
  contentrep: { [key: number]: string } = {};

  constructor(
    private ativeRoute: ActivatedRoute,
    private router: Router,
    private baivietBinhluanService: BvBlService,
    private thichbaivietService: ThichbaivietService,
    private commentService: PostService,
    private socketService: WebSocketService
  ) {
    this.socketService.connect();
    this.userId = Number(
      sessionStorage.getItem('id_user') || localStorage.getItem('id_user')
    );
    this.authToken = String(
      sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    );
    if (!this.userId) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.socketService.connect();
    // Theo dõi sự thay đổi của paramMap
    this.subscription = this.ativeRoute.paramMap.subscribe((paramMap) => {
      const newPostId = paramMap.get('id');
      if (newPostId !== this.post_id) {
        this.post_id = newPostId; // Cập nhật post_id mới
        this.scrollToTopAndLoadPost();
      }
      this.checkUserLike(newPostId);
    });
    this.postId = this.ativeRoute.snapshot.params['id'];
    //cập nhật du liệu khi có nội dung mới
    this.socketService.messages.subscribe((response) => {
      if (response) {
        console.log('New message:', response);
        this.list_comment_post.push(response); // Cập nhật dữ liệu khi nhận được tin nhắn mới
        console.log('list cmt', this.list_comment_post);
      }
      console.log("socket", response)
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
  addComment() {
    if (!this.content) {
      alert('Vui lòng nhập bình luận.');
      return;
    }

    this.commentService
      .addComment(this.postId, this.userId, this.content, this.order)
      .subscribe(
        (response) => {
          // Xử lý phản hồi từ server
          console.log('Bình luận đã được gửi!', response);
          this.content = ''; // Reset textarea sau khi gửi bình luận
          this.socketService.sendMessage(response.data);
        },
        (error) => {
          console.error('Có lỗi xảy ra khi gửi bình luận', error);
        }
      );
  }

  addReply(commentId: number) {
    if (!this.contentrep[commentId]) {
      alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    this.commentService
      .addReply(commentId, this.userId, this.contentrep[commentId], this.order)
      .subscribe(
        (response) => {
          if (response.success) {
            alert(response.message);
            this.contentrep[commentId] = ''; // Xóa nội dung sau khi thêm thành công
            // Cập nhật lại danh sách phản hồi ở đây nếu cần
          } else {
            alert(response.message);
          }
        },
        (error) => {
          console.error('Lỗi khi thêm phản hồi:', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe(); // Sử dụng optional chaining
    this.socketService.disconnect();
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
