import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage =
            error.error?.message ||
            `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        // Handle specific error codes
        if (error.status === 401) {
          // Unauthorized - redirect to login
          this.router.navigate(['/auth/login']);
          errorMessage = 'Session expired. Please log in again.';
        } else if (error.status === 403) {
          // Forbidden
          errorMessage = 'You do not have permission to access this resource.';
        } else if (error.status === 404) {
          // Not found
          errorMessage = 'The requested resource was not found.';
        } else if (error.status === 500) {
          // Server error
          errorMessage = 'Server error. Please try again later.';
        }

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: req.url
        });

        return throwError(() => ({
          status: error.status,
          message: errorMessage,
          originalError: error
        }));
      })
    );
  }
}
