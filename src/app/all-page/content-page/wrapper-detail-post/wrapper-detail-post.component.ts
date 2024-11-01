import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { WrapperRightComponent } from '../wrapper-right/wrapper-right.component';
import { WrapperLeftComponent } from '../wrapper-left/wrapper-left.component';
import { ModalEditPostComponent } from '../../modal-edit-post/modal-edit-post.component';
import { ModalCreatePostComponent } from '../../modal-create-post/modal-create-post.component';
import { FooterComponent } from '../../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { PostService } from '../../../service/dat/post.service';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nhập CommonModule
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-wrapper-detail-post',
  standalone: true,
  imports: [
    HttpClientModule,
    HeaderComponent,
    WrapperRightComponent,
    WrapperLeftComponent,
    ModalEditPostComponent,
    ModalCreatePostComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
 
  ],
  templateUrl: './wrapper-detail-post.component.html',
})
export class WrapperDetailPostComponent implements OnInit{  
  postId: any;
  userCmtId: any; 
  content: string = '';
  order: number = 1; 
  message: string = '';

  constructor(private commentService: PostService, private route: ActivatedRoute,) {
    
  }
  ngOnInit(): void {
    this.postId = this.route.snapshot.params['id'];
    this.userCmtId = Number(localStorage.getItem('id_user'));
  }

  // Hàm thêm bình luận
  addComment() {
    if (!this.content) {
      alert("Vui lòng nhập bình luận.");
      return;
    }

    this.commentService.addComment(this.postId, this.userCmtId, this.content, this.order).subscribe(
      response => {
        if (response.success) {
          this.message = response.success;
          this.content = ''; // Reset nội dung bình luận
        } else {
          this.message = response.error;
        }
      },
      error => {
        console.error('Có lỗi xảy ra khi thêm bình luận:', error);
        this.message = "Có lỗi xảy ra. Vui lòng thử lại.";
      }
    );
  }
}
