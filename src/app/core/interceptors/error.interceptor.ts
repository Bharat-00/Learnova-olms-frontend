import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      let message = 'An unexpected error occurred.';

      if (!navigator.onLine || err.status === 0) {
        message = 'Cannot connect to server. Please ensure Docker backend and API Gateway are running on port 8080.';
      } else if (err.status === 400) {
        message = err.error?.message || 'Invalid request. Please check the entered details.';
      } else if (err.status === 401) {
        message = err.error?.message || 'Invalid email/password or session expired.';
      } else if (err.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (err.status === 404) {
        message = 'The requested resource was not found. Please check frontend API path and gateway route.';
      } else if (err.status === 500) {
        message = err.error?.message || 'Internal server error. Please check service logs.';
      } else if (err.error?.message) {
        message = err.error.message;
      }

      return throwError(() => ({ ...err, userMessage: message }));
    })
  );
};
