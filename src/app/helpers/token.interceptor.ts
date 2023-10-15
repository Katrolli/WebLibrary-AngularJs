import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getToken();

      if (token && !this.isTokenExpired(token)) {
        const newRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(newRequest);
      } else {
        this.authService.removeToken(token);
      }
    }
    return next.handle(req);
  }

  private isTokenExpired(token: string): boolean {
    const decoded: any = this.authService.decodeToken(token);

    if (decoded.exp === undefined) {
      return false;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    const isExpired = !(date.valueOf() > new Date().valueOf());

    return isExpired;
  }
}
