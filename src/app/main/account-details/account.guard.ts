import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map, take } from 'rxjs/operators';
import { AccountService } from '../../shared/account.service';

@Injectable({providedIn: 'root'})
export class AccountGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const index = +route.params.id;
    if (this.accountService.getAccounts().length <= index) {
      return this.router.createUrlTree(['/main']);
    }
    return true;
  }
}
