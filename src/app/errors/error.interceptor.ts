import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from './error.modal.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred.
          errorMsg = `An error occurred: ${error.error.message}`;
        } else {
          // The backend returned an unsuccessful response code.
          errorMsg = `Backend returned code ${error.status}, body was: ${error.error.message}`;
        }

        this.dialog.open(ErrorModalComponent, {
          data: { status: error.status, message: errorMsg },
        });

        return throwError(errorMsg);
      })
    );
  }
}
