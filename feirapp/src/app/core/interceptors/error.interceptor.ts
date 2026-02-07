import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(

    catchError(error => {

      let message = 'Unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        message = error.error.message;
      } else {

        switch (error.status) {

          case 401:
            message = 'Session expired. Please login again.';
            auth.logout();
            router.navigate(['/auth/login']);
            break;

          case 403:
            message = 'Access denied.';
            break;

          case 404:
            message = 'Resource not found.';
            break;

          case 500:
            message = 'Server error. Try later.';
            break;

          default:
            message =
              error.error?.message ||
              error.message ||
              message;
        }
      }

      console.error('[HTTP ERROR]', {
        url: req.url,
        status: error.status,
        message
      });

      return throwError(() => new Error(message));

    })
  );
};
