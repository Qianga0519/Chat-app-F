import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BvBlService {
  constructor(private http: HttpClient) {}
  getPostById(post_id: number) {
    return this.http.get(
      `http://localhost:8080/chat_api/baiviet_binhluanApi/posts/getPostById.php?id=${post_id}`
    );
  }
  getAvatarUser(user_id: number) {
    return this.http.get(
      `http://localhost:8080/chat_api/baiviet_binhluanApi/media/getAvatarUser.php?user_id=${user_id}`
    );
  }
  getUpdatePost(post_id: number) {
    return this.http.get(
      `http://localhost:8080/chat_api/baiviet_binhluanApi/posts/getUpdatePost.php?post_id=${post_id}`
    );
  }
  checkUserLikePost(user_id: number, post_id: number) {
    return this.http.get(
      `http://localhost:8080/chat_api/baiviet_binhluanApi/posts/getUserLikePostId.php?user_id=${user_id}&post_id=${post_id}`
    );
  }
  getListCommentPost(post_id: number){
    return this.http.get(
      `http://localhost:8080/chat_api/baiviet_binhluanApi/comment/getCommentPostId.php?post_id=${post_id}`
    );
  }
}
