import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DanhsachbaivietService {
  private apiUrl =
    'http://localhost:8080/chat_api/danhsachbaivietApi/posts/getPostPagi.php';

  constructor(private http: HttpClient) {}

  getPosts(lastPostId: number, limit: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}?lastPostId=${lastPostId}&limit=${limit}`
    );
  }
}
