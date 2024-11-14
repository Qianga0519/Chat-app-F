import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './service/quang/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // Kiểm tra sessionStorage và localStorage có khả dụng không
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token =
        sessionStorage.getItem('authToken') ||
        localStorage.getItem('authToken');
    }

    if (token) {
      return this.authService.verifyToken().pipe(
        map(() => true), // Token hợp lệ, cho phép truy cập
        catchError((error) => {
          console.error('Token không hợp lệ hoặc hết hạn:', error);
          this.router.navigate(['/login']); // Điều hướng về trang đăng nhập
          return of(false);
        })
      );
    } else {
      console.warn('Không tìm thấy token, chuyển hướng đến đăng nhập.');
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}
