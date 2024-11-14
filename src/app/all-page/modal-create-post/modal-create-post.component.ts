import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostServices } from '../../service/kien/post.service';

@Component({
  selector: 'app-modal-create-post',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule], // Sửa lại không cần NgModule
  templateUrl: './modal-create-post.component.html',
  styleUrls: ['./modal-create-post.component.css'], // Sửa styleUrl thành styleUrls
})
export class ModalCreatePostComponent {
  postContent: string = '';
  imageUrl: string | null = null;
  privacy: string = 'assets'; // Lựa chọn quyền riêng tư
  userId: number = 1; // Giả định ID người dùng
  selectedFile: File | null = null;

  constructor(private postService: PostServices) {}

  // Hàm xử lý chọn ảnh
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Kiểm tra tệp có phải là hình ảnh không
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/jpeg',
      ];
      if (validImageTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string; // Lưu tạm thời đường dẫn ảnh base64
        };
        reader.readAsDataURL(file);
        this.selectedFile = file;
      } else {
        alert('Please select a valid image file (jpg, png, gif,jpeg)');
      }
    }
  }

  // Hàm xóa ảnh đã chọn
  removeImage(): void {
    this.imageUrl = null;
    this.selectedFile = null; // Xóa tệp đã chọn
    
  }

  // Hàm gửi bài viết
  createPost(): void {
    // console.log(this.selectedFile)
    if (this.postContent) {
      this.postService
        .createPost(this.userId, this.postContent, this.selectedFile)
        .subscribe(
          (response) => {
            if (response.success) {
            }
            console.log(response)
          },
          (error) => {
            console.error('Error creating post:', error);
          }
        );
    } else {
      alert('Please enter content for the post');
    }
  }

  // Reset form sau khi gửi bài
  resetForm(): void {
    this.postContent = '';
    this.imageUrl = null;
    this.selectedFile = null;
  }
}
