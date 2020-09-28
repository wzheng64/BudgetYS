import { HelperService } from './helper.service';
import { IdService } from './id.service';
import { Transaction } from './transaction.model';
import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({ providedIn: 'root' })
export class AccountService {
  accountsChanged = new Subject<{[s: string]: Account}>();
  transactionsChanged = new Subject<{[date: number]: {[s: string]: Transaction}}>();
  transToCat = new Subject<Transaction>();
  mainChanged = new Subject<Account>();

  constructor(private idService: IdService, private help: HelperService){}

  private accounts: {[s: string]: Account} = {};
  private mainAccount: string;

  public getAccounts(): {[s: string]: Account} {
    return {... this.accounts};
  }

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
    const week = this.help.getWeek(trans.date);
    const realTrans = new Transaction(trans.name, trans.date, trans.description,
                                      trans.amount, trans.type, trans.id, trans.category);
    if (!(week in this.accounts[accID].transactions)) {
      this.accounts[accID].transactions[week] = {};
    }
    this.accounts[accID].transactions[week][realTrans.id] = realTrans;
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
    if (trans.category) {
      this.transToCat.next(trans);
    }
    this.transactionsChanged.next(this.accounts[accID].transactions);
    this.accountsChanged.next({...this.accounts});
  }

  public updateTransaction(accID: string, trans: Transaction, tID: string, oldDate: string): void {
    this.deleteTransaction(accID, tID, oldDate);
    const week = this.help.getWeek(trans.date);
    if (!this.accounts[accID].transactions[week]) {
      this.accounts[accID].transactions[week] = {};
    }
    const realTrans = {... trans, id: tID};
    this.accounts[accID].transactions[week][tID] = realTrans;
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
    if (trans.category) {
      this.transToCat.next(trans);
    }
    this.transactionsChanged.next({... this.accounts[accID].transactions});
    this.accountsChanged.next({...this.accounts});
  }

  public getTransactions(accID: number): {[date: number]: {[s: string]: Transaction}} {
    return {... this.accounts[accID].transactions};
  }

  public deleteTransaction(accID: string, tID: string, date: string): void {
    const week = this.help.getWeek(date);
    const trans = this.accounts[accID].transactions[week][tID];
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
    delete this.accounts[accID].transactions[week][tID];
    this.transactionsChanged.next({... this.accounts[accID].transactions});
    this.accountsChanged.next({...this.accounts});
    this.idService.deleteTrans(trans.id);
  }
}
