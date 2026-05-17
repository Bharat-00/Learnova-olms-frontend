import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const user = authService.getCurrentUser();

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (user?.email) {
    headers['X-User-Email'] = user.email;
  }

  if (user?.role) {
    headers['X-User-Role'] = user.role;
  }

  const authReq = Object.keys(headers).length > 0 ? req.clone({ setHeaders: headers }) : req;

  return next(authReq).pipe(
    catchError(err => throwError(() => err))
  );
};
