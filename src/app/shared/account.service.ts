import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({ providedIn: 'root' })
export class AccountService {
  accountsChanged = new Subject<Account[]>();

  private accounts: Account[] = [];

  public getAccounts(): Account[] {
    return this.accounts.slice();
  }

  public getAccount(id: number): Account {
    return this.accounts.slice()[id];
  }

  public addAccount(acc: Account): void {
    this.accounts.push(acc);
    this.accountsChanged.next(this.accounts.slice());
  }

  public setAccounts(accounts: Account[]): void {
    this.accounts = accounts;
    this.accountsChanged.next(this.accounts.slice());
  }
}
