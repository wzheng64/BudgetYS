import { Transaction } from './transaction.model';
import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({ providedIn: 'root' })
export class AccountService {
  accountsChanged = new Subject<Account[]>();
  transactionsChanged = new Subject<Transaction[]>();

  constructor(){}

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

  public addTransaction(accID: number, trans: Transaction): void {
    console.log(this.accounts, accID);
    this.accounts[accID].transactions.push(trans);
    this.transactionsChanged.next(this.accounts[accID].transactions);
  }

  public getTransactions(accID: number): Transaction[] {
    return this.accounts[accID].transactions.slice();
  }
}
