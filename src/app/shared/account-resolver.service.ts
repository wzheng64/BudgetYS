import { AccountService } from './account.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Account } from './account.model';
import { DataStorageService } from './data-storage.service';

@Injectable({ providedIn: 'root' })
export class AccountResolverService implements Resolve<{ [s: string]: Account; }>{
  constructor(private data: DataStorageService, private accountService: AccountService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): { [s: string]: Account; } |
   Observable<{ [s: string]: Account; }> | Promise<{ [s: string]: Account; }> {
    const accs = this.accountService.getAccounts();

    if (Object.keys(accs).length === 0) {
      this.data.getMain();
      this.data.getIncome();
      return this.data.fetchAccounts();
    }
    else {
      return accs;
    }
  }


}
