import { IdService } from './id.service';
import { Transaction } from './transaction.model';
import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({ providedIn: 'root' })
export class AccountService {
  accountsChanged = new Subject<Account[]>();
  transactionsChanged = new Subject<Transaction[]>();

  constructor(private idService: IdService){}

  private accounts: Account[] = [];
  private mainAccount: string;

  public getAccounts(): Account[] {
    return this.accounts.slice();
  }

  public getAccountByIndex(index: number): Account {
    return this.accounts.slice()[index];
  }

  public getAccountById(id: string): Account {
    this.accounts.forEach((acc, i) => {
      if (acc.id === id) {
        return this.accounts.slice()[i];
      }
    });
    return null;
  }

  public addAccount(acc: Account): void {
    const realAcc = new Account(acc.name, acc.type, acc.transactions, acc.balance, this.idService.generateAcc());
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
    this.idService.deleteAcc(this.accounts[accID].id);
    this.accounts.splice(accID, 1);
    this.accountsChanged.next(this.accounts.slice());
  }

  public setAccounts(accounts: Account[]): void {
    this.accounts = accounts;
    this.accountsChanged.next(this.accounts.slice());
  }

  public setMain(id: string): void {
    this.accounts.forEach((acc, i) => {
      if (acc.id === id) {
        this.mainAccount = id;
      }
    });
  }

  public getMain(): Account {
    return this.getAccountById(this.mainAccount);
  }

  public addTransaction(accID: number, trans: Transaction): void {
    const realTrans = new Transaction(trans.name, trans.date, trans.description, trans.amount, trans.type, this.idService.generateTrans());
    this.accounts[accID].transactions.push(realTrans);
    if (this.accounts[accID].type === 'CC') {
      if (trans.type === '-') {
        this.accounts[accID].balance += trans.amount;
      }
      else {
        this.accounts[accID].balance -= trans.amount;
      }
    }
    else {
      if (trans.type === '-') {
        this.accounts[accID].balance -= trans.amount;
      }
      else {
        this.accounts[accID].balance += trans.amount;
      }
    }
    this.transactionsChanged.next(this.accounts[accID].transactions.slice());
    this.accountsChanged.next(this.accounts.slice());
  }

  public updateTransaction(accID: number, trans: Transaction, tID: number): void {
    const oldT = this.accounts[accID].transactions[tID];
    if (this.accounts[accID].type === 'CC') {
      if (oldT.type === '-') {
        this.accounts[accID].balance -= oldT.amount;
      }
      else {
        this.accounts[accID].balance += oldT.amount;
      }
    }
    else {
      if (oldT.type === '-') {
        this.accounts[accID].balance += oldT.amount;
      }
      else {
        this.accounts[accID].balance -= oldT.amount;
      }
    }
    this.accounts[accID].transactions[tID].amount = trans.amount;
    this.accounts[accID].transactions[tID].date = trans.date;
    this.accounts[accID].transactions[tID].description = trans.description;
    this.accounts[accID].transactions[tID].name = trans.name;
    this.accounts[accID].transactions[tID].type = trans.type;
    if (this.accounts[accID].type === 'CC') {
      if (trans.type === '-') {
        this.accounts[accID].balance += trans.amount;
      }
      else {
        this.accounts[accID].balance -= trans.amount;
      }
    }
    else {
      if (trans.type === '-') {
        this.accounts[accID].balance -= trans.amount;
      }
      else {
        this.accounts[accID].balance += trans.amount;
      }
    }
    this.transactionsChanged.next(this.accounts[accID].transactions.slice());
    this.accountsChanged.next(this.accounts.slice());
  }

  public getTransactions(accID: number): Transaction[] {
    return this.accounts[accID].transactions.slice();
  }

  public deleteTransaction(accID: number, tID: number): void {
    const trans = this.accounts[accID].transactions[tID];
    if (this.accounts[accID].type === 'CC') {
      if (trans.type === '-') {
        this.accounts[accID].balance -= trans.amount;
      }
      else {
        this.accounts[accID].balance += trans.amount;
      }
    }
    else {
      if (trans.type === '-') {
        this.accounts[accID].balance += trans.amount;
      }
      else {
        this.accounts[accID].balance -= trans.amount;
      }
    }
    this.accounts[accID].transactions.splice(tID, 1);
    this.transactionsChanged.next(this.accounts[accID].transactions.slice());
    this.accountsChanged.next(this.accounts.slice());
    this.idService.deleteTrans(trans.id);
  }
}
