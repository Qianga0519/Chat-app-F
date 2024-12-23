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
    return this.authService.verifyToken().pipe(
      map((response: any) => {
        if (response.success) {
          return true; // Token hợp lệ
        } else {
          this.router.navigate(['/login']); // Token không hợp lệ, điều hướng đến login
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']); // Lỗi khi gọi API, điều hướng đến login
        return of(false);
      })
    );
  }
}
