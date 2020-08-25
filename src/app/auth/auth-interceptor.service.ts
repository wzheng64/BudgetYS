import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  // Will attach the auth token to all outgoing requests
  // except for the case when no user is signed in
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {

        // If no user is currently logged in, do not modify the request
        if (!user) {
          return next.handle(req);
        }
        // Otherwise attach the auth token to the outgoing request
        const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
        return next.handle(modifiedReq);
      }));
  }
}
