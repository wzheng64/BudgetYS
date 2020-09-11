import { Category } from './category.model';
import { Subject } from 'rxjs';
import { IdService } from './id.service';
import { Transaction } from './transaction.model';
import { Income } from './income.model';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { TransactionType } from './enums';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  incomeChanged = new Subject<Income>();
  catChanged = new Subject<{[s: string]: Category}>();
  currentPeriodChanged = new Subject<string>();

  constructor(private idService: IdService, private accountService: AccountService) { }

  private income: Income;
  private categories: {[s: string]: Category} = {};
  private currentPeriod = '';

  getIncome(): Income {
    return { ... this.income };
  }

  setIncome(income: Income): void {
    this.income = income;
    this.incomeChanged.next({ ... this.income });
  }

  getPayDate(): string {
    return { ... this.income }.lastPayDate;
  }

  setPayDate(date: Date): void {
    this.income.lastPayDate = date.toLocaleDateString('en-CA');
  }

  getPeriods(): string[] {
    return ['Weekly', 'Bi-Weekly', 'Monthly'];
  }

  payIncome(): boolean {
    const today = new Date();
    const paid = new Date(this.income.lastPayDate);
    let changed = false;
    if (this.income.period === 'Weekly') {
      let leftover = this.income.income;
      while (paid.setUTCDate(paid.getUTCDate() + 7) <= today.valueOf()) {
        changed = true;
        this.income.accounts.forEach((acc) => {
          const payment = new Transaction(`${this.income.period} Income payment`,
            new Date(paid).toLocaleDateString('en-CA'),
            `${this.income.period} Automatic Income payment for ${paid.toLocaleDateString('en-CA')}`,
            acc.proportion,
            TransactionType.Plus, this.idService.generateTrans());
          this.accountService.addTransaction(acc.accountID, payment);
          leftover -= acc.proportion;
        });
        const payRemainder = new Transaction(`${this.income.period} Income payment`,
          new Date(paid).toLocaleDateString('en-CA'),
          `${this.income.period} Automatic Income payment for ${paid.toLocaleDateString('en-CA')}`,
          leftover,
          TransactionType.Plus, this.idService.generateTrans());
        this.accountService.addTransaction(this.income.remainder, payRemainder);
      }
      paid.setUTCDate(paid.getUTCDate() - 7);
    }
    else if (this.income.period === 'Bi-Weekly') {
      let leftover = this.income.income;
      while (paid.setUTCDate(paid.getUTCDate() + 14) <= today.valueOf()) {
        changed = true;
        this.income.accounts.forEach((acc) => {
          const payment = new Transaction(`${this.income.period} Income payment`,
            new Date(paid).toLocaleDateString('en-CA'),
            `${this.income.period} Automatic Income payment for ${paid.toLocaleDateString('en-CA')}`,
            acc.proportion,
            TransactionType.Plus, this.idService.generateTrans());
          this.accountService.addTransaction(acc.accountID, payment);
          leftover -= acc.proportion;
        });
        const payRemainder = new Transaction(`${this.income.period} Income payment`,
          new Date(paid).toLocaleDateString('en-CA'),
          `${this.income.period} Automatic Income payment for ${paid.toLocaleDateString('en-CA')}`,
          leftover,
          TransactionType.Plus, this.idService.generateTrans());
        this.accountService.addTransaction(this.income.remainder, payRemainder);
      }
      paid.setUTCDate(paid.getUTCDate() - 14);
    }
    else {
      let leftover = this.income.income;
      while (paid.setUTCMonth(paid.getUTCMonth() + 1) <= today.valueOf()) {
        changed = true;
        this.income.accounts.forEach((acc) => {
          const payment = new Transaction(`${this.income.period} Income payment`,
            new Date(paid).toLocaleDateString('en-CA'),
            `${this.income.period} Automatic Income payment for ${paid.toLocaleDateString('en-CA')}`,
            acc.proportion,
            TransactionType.Plus, this.idService.generateTrans());
          this.accountService.addTransaction(acc.accountID, payment);
          leftover -= acc.proportion;
        });
        const payRemainder = new Transaction(`${this.income.period} Income payment`,
          new Date(paid).toLocaleDateString('en-CA'),
          `${this.income.period} Automatic Income payment for ${paid.toLocaleDateString('en-CA')}`,
          leftover,
          TransactionType.Plus, this.idService.generateTrans());
        this.accountService.addTransaction(this.income.remainder, payRemainder);
      }
      paid.setUTCMonth(paid.getUTCMonth() - 1);
    }
    // Set the new paydate
    if (changed) {
      this.setPayDate(new Date(paid.getUTCFullYear(), paid.getUTCMonth(), paid.getUTCDate()));
    }
    return changed;
  }

  addCategory(cat: Category): void {
    this.categories[cat.id] = cat;
    this.catChanged.next(this.categories);
  }

  getCategories(): {[s: string]: Category} {
    return {... this.categories};
  }

  setCategories(cats: {[s: string]: Category}): void {
    this.categories = cats;
  }

  getCurrentPeriod(): string {
    return this.currentPeriod;
  }

  setCurrentPeriod(s: string): void {
    this.currentPeriod = s;
    this.currentPeriodChanged.next(this.currentPeriod);
  }
}
