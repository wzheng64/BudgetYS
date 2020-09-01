import { IdService } from './id.service';
import { Transaction } from './transaction.model';
import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({ providedIn: 'root' })
export class AccountService {
  accountsChanged = new Subject<{[s: string]: Account}>();
  transactionsChanged = new Subject<Transaction[]>();
  mainChanged = new Subject<Account>();

  constructor(private idService: IdService){}

  private accounts: {[s: string]: Account} = {};
  private mainAccount: string;

  public getAccounts(): {[s: string]: Account} {
    return {... this.accounts};
  }

  // public getAccountByIndex(index: number): Account {
  //   return this.accounts.slice()[index];
  // }

  public getAccountById(id: string): Account {
    return {... this.accounts}[id];
  }

  public addAccount(acc: Account): void {
    const realAcc = new Account(acc.name, acc.type, acc.transactions, acc.balance, acc.id);
    this.accounts[acc.id] = realAcc;
    this.accountsChanged.next({...this.accounts});
  }

  public modifyAccount(acc: Account, accID: string): void {
    this.accounts[accID].balance = acc.balance;
    this.accounts[accID].name = acc.name;
    this.accounts[accID].type = acc.type;
    this.accountsChanged.next({...this.accounts});
  }

  public deleteAccount(id: string): void {
    this.idService.deleteAcc(this.accounts[id].id);
    delete this.accounts[id];
    this.accountsChanged.next({...this.accounts});
  }

  public setAccounts(accounts: {[s: string]: Account}): void {
    this.accounts = accounts;
    this.accountsChanged.next({...this.accounts});
  }

  public setMain(id: string): void {
    this.mainAccount = id;
    this.mainChanged.next(this.getMain());
  }

  public getMain(): Account {
    return {...this.accounts}[this.mainAccount];
  }

  public addTransaction(accID: string, trans: Transaction): void {
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
    this.accountsChanged.next({...this.accounts});
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
    this.accountsChanged.next({...this.accounts});
  }

  public getTransactions(accID: number): Transaction[] {
    return this.accounts[accID].transactions.slice();
  }

  public deleteTransaction(accID: string, tID: number): void {
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
    this.accountsChanged.next({...this.accounts});
    this.idService.deleteTrans(trans.id);
  }
}
