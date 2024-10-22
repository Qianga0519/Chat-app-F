import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { WrapperRightComponent } from '../wrapper-right/wrapper-right.component';
import { WrapperLeftComponent } from '../wrapper-left/wrapper-left.component';
import { ModalEditPostComponent } from '../../modal-edit-post/modal-edit-post.component';
import { ModalCreatePostComponent } from '../../modal-create-post/modal-create-post.component';
import { FooterComponent } from '../../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { PostService } from '../../../service/dat/post.service';
import { DanhsachbaivietService } from '../../../service/dsbaiviet/danhsachbaiviet.service';
import { CommonModule } from '@angular/common';

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

  toggleSeeMore(post: any) {
    post.showFullContent = !post.showFullContent;
  }
  constructor(private listPostService: DanhsachbaivietService) {}

  ngOnInit() {
    this.loadPosts(); // Tải bài viết ban đầu
    window.addEventListener('scroll', this.onScroll.bind(this)); // Lắng nghe sự kiện cuộn
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }
  loadPosts() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.listPostService.getPosts(this.lastPostId, this.limit).subscribe(
        (data: any[]) => {
          console.log('Dữ liệu nhận được:', data); // Ghi lại dữ liệu nhận được
          this.posts = [...this.posts, ...data];
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
}
