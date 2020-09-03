import { IdService } from './id.service';
import { Transaction } from './transaction.model';
import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class BudgetService {

  constructor(private idService: IdService, private accountService: AccountService){}

  private income: number;
  private period: string;
  private lastPayDate: Date;

  getIncome(): number {
    return this.income;
  }

  setIncome(amount: number): void {
    this.income = amount;
  }

  getPeriod(): string {
    return this.period;
  }

  setPeriod(period: string): void {
    this.period = period;
  }

  getPayDate(): Date {
    return this.lastPayDate;
  }

  setPayDate(date: Date): void {
    this.lastPayDate = date;
  }

  getPeriods(): string[] {
    return ['Weekly', 'Bi-Weekly', 'Monthly'];
  }
}
