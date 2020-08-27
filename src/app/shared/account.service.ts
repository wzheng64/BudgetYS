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
    const realAcc = new Account(acc.name, acc.type, acc.transactions, acc.balance);
    this.accounts.push(realAcc);
    this.accountsChanged.next(this.accounts.slice());
  }

  public deleteAccount(accID: number): void {
    this.accounts.splice(accID, 1);
    this.accountsChanged.next(this.accounts.slice());
  }

  public setAccounts(accounts: Account[]): void {
    this.accounts = accounts;
    this.accountsChanged.next(this.accounts.slice());
  }

  public addTransaction(accID: number, trans: Transaction): void {
    this.accounts[accID].transactions.push(trans);
    if (trans.type === '-') {
      this.accounts[accID].balance -= trans.amount;
    }
    else {
      this.accounts[accID].balance += trans.amount;
    }
    this.transactionsChanged.next(this.accounts[accID].transactions.slice());
    this.accountsChanged.next(this.accounts.slice());
  }

  public getTransactions(accID: number): Transaction[] {
    return this.accounts[accID].transactions.slice();
  }

  public deleteTransaction(accID: number, tID: number): void {
    const t = this.accounts[accID].transactions[tID];
    if (t.type === '-') {
      this.accounts[accID].balance += t.amount;
    }
    else {
      this.accounts[accID].balance -= t.amount;
    }
    this.accounts[accID].transactions.splice(tID, 1);
    this.transactionsChanged.next(this.accounts[accID].transactions.slice());
    this.accountsChanged.next(this.accounts.slice());
  }
}
