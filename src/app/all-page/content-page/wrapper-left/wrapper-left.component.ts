import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GoiybanbeService } from '../../../service/goiybanbe/goiybanbe.service';
import { response } from 'express';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wrapper-left',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './wrapper-left.component.html',
  styleUrl: './wrapper-left.component.css',
})
export class WrapperLeftComponent implements OnInit {
  listHint: any = [];
  userId: number;
  authToken: string;
  path_media = 'http://localhost:8080/chat_api/uploads';
  constructor(private goiybanbeService: GoiybanbeService) {
    this.userId = Number(
      localStorage.getItem('id_user') || sessionStorage.getItem('id_user')
    );
    this.authToken = String(
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    );
  }
  ngOnInit(): void {
    this.getListHint(this.userId);
  }

  getListHint(userId: number) {
    this.goiybanbeService.getListHint(userId).subscribe((response: any) => {
      if (response.success) {
        this.listHint = response.data;
        console.log(this.listHint);
        console.log('list hint', response);
      }
    });
  }
}
