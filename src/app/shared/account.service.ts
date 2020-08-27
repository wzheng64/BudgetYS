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

  public modifyAccount(acc: Account, accID: number): void {
    this.accounts[accID].balance = acc.balance;
    this.accounts[accID].name = acc.name;
    this.accounts[accID].type = acc.type;
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

  public updateTransaction(accID: number, trans: Transaction, tID: number): void {
    const oldAcc = this.accounts[accID];
    const oldT = this.accounts[accID].transactions[tID];
    if (oldT.type === '-') {
      this.accounts[accID].balance += oldT.amount;
    }
    else {
      this.accounts[accID].balance -= oldT.amount;
    }
    this.accounts[accID].transactions[tID].amount = trans.amount;
    this.accounts[accID].transactions[tID].date = trans.date;
    this.accounts[accID].transactions[tID].description = trans.description;
    this.accounts[accID].transactions[tID].name = trans.name;
    this.accounts[accID].transactions[tID].type = trans.type;
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
