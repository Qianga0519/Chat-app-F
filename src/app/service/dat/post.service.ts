// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient, private router: Router) {}

  postbyid(id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8080/chat_api/api_dat/posts/getPostById.php?user_id=${id}`,
      {
        headers: { 'Content-Type': 'application/json' }, // Thiết lập header nếu cần
      }
    );
  }
  postlikebyid(id: number) {
    return this.http.get(
      `http://localhost:8080/chat_api/thichbaivietApi/postLike/getLikeCount.php?post_id=${id}`,
      {
        headers: { 'Content-Type': 'application/json' }, // Thiết lập header nếu cần
      }
    );
  }
  searchPost(
    keyword: string,
    orderBy: number,
    postFrom: number,
    currentUserId: any,
    offset: number = 0,
    limit: number = 10
  ): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8080/chat_api/api_dat/posts/search.php?keyword=${keyword}&orderBy=${orderBy}&postFrom=${postFrom}&currentUserId=${currentUserId}&offset=${offset}&limit=${limit}`
    );
  }
  sharePost(postId: number, userId: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8080/chat_api/api_dat/posts/postShare.php`,
      { post_id: postId, user_share_id: userId }, // Sửa lại tên trường JSON
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  kiemTraID(id: number): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8080/chat_api/api_dat/posts/PostId.php?id=${id}`
    );
  }
  addComment(postId: number, userCmtId: number, content: string, order: number): Observable<any> {
    const body = {
      post_id: postId,
      user_cmt_id: userCmtId,
      content: content,
      order: order
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`http://localhost:8080/chat_api/api_dat/posts/cmt.php`, body, { headers });
  }
  addReply(cmtId: number, userId: number, content: string, order: number): Observable<any> {
    const body = { cmt_id: cmtId, user_id: userId, content: content, order: order };
    return this.http.post<any>(`http://localhost:8080/chat_api/api_dat/posts/rep_cmt.php`, body);
  }
  
}
