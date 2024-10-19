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
    const token = localStorage.getItem('authToken');
    if (token) {
      return this.authService.verifyToken().pipe(
        map(() => {
          // Nếu token hợp lệ, cho phép truy cập
          return true;
        }),
        catchError(() => {
          // Nếu token không hợp lệ, điều hướng về trang đăng nhập
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      // Nếu không có token, điều hướng về trang đăng nhập
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}
