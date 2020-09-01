// import { Account } from './../../shared/account.model';
// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, Params } from '@angular/router';
// import { Observable } from 'rxjs/internal/Observable';
// import { map, take } from 'rxjs/operators';
// import { AccountService } from '../../shared/account.service';
// import { DataStorageService } from 'src/app/shared/data-storage.service';

// @Injectable({ providedIn: 'root' })
// export class AccountGuard implements CanActivate {
//   constructor(private accountService: AccountService, private router: Router, private db: DataStorageService) { }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree |
//     Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
//       return this.db.fetchAccounts().toPromise().then((res) => {
//         const index = +route.params.id;
//         if (this.accountService.getAccounts().length <= index) {
//           return this.router.createUrlTree(['/main']);
//         }
//         return true;
//       });
//   }
// }
