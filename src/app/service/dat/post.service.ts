// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
}
