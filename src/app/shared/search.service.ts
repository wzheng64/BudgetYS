import { BudgetService } from './budget.service';
import { AccountService } from './account.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({ providedIn: 'root' })
export class SearchService {
  searchChanged = new Subject<string>();
  dateChanged = new Subject<string[]>();
  sortChanged = new Subject<string>();

  constructor(private accountService: AccountService, private budgetService: BudgetService){}

}
