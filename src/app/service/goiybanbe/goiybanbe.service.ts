import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoiybanbeService {
  constructor(private http: HttpClient) {}
  getListHint(id_user:number){
    return this.http.get(`http://localhost:8080/goiybanbe/friend/getListHint`
      
    )
  }
}
