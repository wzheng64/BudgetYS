import { Subject } from 'rxjs';
import { IdService } from './id.service';
import { Transaction } from './transaction.model';
import { Account } from './account.model';
import { Income } from './income.model';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  incomeChanged = new Subject<Income>();

  constructor(private idService: IdService, private accountService: AccountService){}

  private income: Income;

  getIncome(): Income {
    return {... this.income};
  }

  setIncome(income: Income): void {
    this.income = income;
    this.incomeChanged.next({... this.income});
    console.log(this.income);
  }

  getPayDate(): Date {
    return {... this.income}.lastPayDate;
  }

  setPayDate(date: Date): void {
    this.income.lastPayDate = date;
  }

  getPeriods(): string[] {
    return ['Weekly', 'Bi-Weekly', 'Monthly'];
  }
}
