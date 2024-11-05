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

  postbyid(id: number) : Observable<any[]>{
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
}
