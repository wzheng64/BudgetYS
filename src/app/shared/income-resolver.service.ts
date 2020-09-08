import { Income } from './income.model';
import { BudgetService } from './budget.service';
import { AccountService } from './account.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Account } from './account.model';
import { DataStorageService } from './data-storage.service';

@Injectable({ providedIn: 'root' })
export class IncomeResolverService implements Resolve<Income>{
  constructor(private data: DataStorageService, private budgetService: BudgetService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Income |
   Observable<Income> | Promise<Income> {
    const inc = this.budgetService.getIncome();

    if (Object.keys(inc).length === 0) {
      return this.data.getIncome();
    }
    else {
      return inc;
    }
  }
}
