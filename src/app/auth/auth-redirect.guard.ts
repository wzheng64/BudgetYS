// This file will redirect the auth page to the main page when
// the user is already logged in.

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthRedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(take(1), map(user => {
      const isAuth = !!user;
      if (isAuth) {
        return this.router.createUrlTree(['/main']);
      }
      return true;
    }));
  }
}
