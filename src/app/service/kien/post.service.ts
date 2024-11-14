import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostServices {

  constructor(private http: HttpClient) { }

  // Phương thức để lấy bài viết theo ID
  postById(id: number): Observable<any> {
    return this.http.get(
      `http://localhost:8080/chat_online_api.git/api_kien/posts/createPost.php?user_id=${id}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Phương thức để tạo bài viết mới
  private apiUrl = 'http://localhost:8080/chat_api/api_kien/posts/createPost.php'; // Your API endpoint



  createPost(
    userId: number,
    content: string,
    mediaFiles: File | null
  ): Observable<any> {
    const formData = new FormData();
  
    // Thêm dữ liệu vào formData
    formData.append('userId', userId.toString());
    formData.append('content', content);
  
    // Nếu có tệp tin, thêm vào formData
    if (mediaFiles) {
      formData.append('mediaFiles', mediaFiles, mediaFiles.name);
    }
  
    // Gửi dữ liệu đến API
    return this.http.post<any>(
      `http://localhost:8080/chat_api/api_kien/posts/createPost.php`,
      formData
    );
  }
  

}
