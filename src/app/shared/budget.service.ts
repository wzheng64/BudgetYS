import { HelperService } from './helper.service';
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
  catChanged = new Subject<{ [s: string]: Category }>();
  currentPeriodChanged = new Subject<string>();

  constructor(private idService: IdService, private accountService: AccountService, private help: HelperService) { }

  private income: Income;
  private categories: { [categoryid: string]: Category } = {};
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
    const utcToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()).valueOf();
    const localPaidDate = new Date(this.income.lastPayDate);
    const paid = new Date(localPaidDate.getUTCFullYear(), localPaidDate.getUTCMonth(), localPaidDate.getUTCDate());
    let changed = false;
    if (Object.prototype.hasOwnProperty.call(this.income, 'income') && this.income.income > 0) {
      if (this.income.period === 'Weekly') {
        let leftover = this.income.income;
        while (paid.setUTCDate(paid.getUTCDate() + 7) < utcToday) {
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
        while (paid.setUTCDate(paid.getUTCDate() + 14) < utcToday) {
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
        while (paid.setUTCMonth(paid.getUTCMonth() + 1) < utcToday) {
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
    }
    return changed;
  }

  addCategory(cat: Category): void {
    this.categories[cat.id] = cat;
    this.catChanged.next(this.categories);
  }

  getCategory(categoryid: string): Category {
    return this.categories[categoryid];
  }

  getCategories(): { [s: string]: Category } {
    return { ... this.categories };
  }

  setCategories(cats: { [s: string]: Category }): void {
    this.categories = cats;
  }

  getCurrentPeriod(): string {
    return this.currentPeriod;
  }

  setCurrentPeriod(s: string): void {
    this.currentPeriod = s;
    this.currentPeriodChanged.next(this.currentPeriod);
  }

  addTransaction(trans: Transaction): void {
    const categoryid = trans.category;
    const week = this.help.getWeek(trans.date);
    if (!this.categories[categoryid].transactions[week]) {
      this.categories[categoryid].transactions[week] = {};
    }
    this.categories[categoryid].transactions[week][trans.id] = trans;
    this.catChanged.next({ ... this.categories });
  }

  deleteTransaction(trans: Transaction): void {
    const week = this.help.getWeek(trans.date);
    delete this.categories[trans.category].transactions[week][trans.id];
    this.catChanged.next({ ... this.categories });
  }
}
