import { AccountService } from './account.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Account } from './account.model';
import { DataStorageService } from './data-storage.service';

@Injectable({providedIn: 'root'})
export class AccountResolverService implements Resolve<Account[]>{
  constructor(private data: DataStorageService, private accountService: AccountService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Account[] | Observable<Account[]> | Promise<Account[]> {
    const accs = this.accountService.getAccounts();

    if (accs.length === 0) {
      return this.data.fetchAccounts();
    }
    else {
      return accs;
    }
  }


}
