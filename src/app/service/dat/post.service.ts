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

    postbyid(id: number){
      return this.http.get(
        `http://localhost:8080/chat_api/api_dat/posts/getPostById.php?user_id=${id}`,
        {
          headers: { 'Content-Type': 'application/json' } // Thiết lập header nếu cần				
        }
      )
    }
    searchPost(keyword: string, offset: number = 0, limit: number = 10): Observable<any> {
      const params = new HttpParams()
        .set('keyword', keyword)
        .set('offset', offset.toString())
        .set('limit', limit.toString());
  
      return this.http.get(`http://localhost:8080/chat_api/api_dat/posts/search.php`, { params });
    }
}
