import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.loadToken();

  // Clone the request to add the Authorization header if the token exists
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        // If 401 or 403, log the user out
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
