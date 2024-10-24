import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThichbaivietService {
  constructor(private http: HttpClient) {}
  createPostLikeByPostId(data: {
    post_id: number;
    user_id: number;
    authToken: string;
  }): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8080/chat_api/thichbaivietApi/postLike/post_like.php`,
      data
    );
  }
  checkLiked(data: {
    post_id: number;
    user_id: number;
    authToken: string;
  }): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8080/chat_api/thichbaivietApi/postLike/checkLiked.php`,
      data
    );
  }
  getLikesCount(postId: number) {
    return this.http.get<any>(
      `http://localhost:8080/chat_api/thichbaivietApi/postLike/getLikeCount.php?post_id=${postId}`
    );
  }
  getUserLikePost(user_id:number){
    return this.http.get<any>(
      `http://localhost:8080/chat_api/thichbaivietApi/postLike/getUserLikePost.php?user_id=${user_id}`
    );
  }
}
