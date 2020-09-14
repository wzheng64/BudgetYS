import { AccountType } from './../../shared/enums';
import { Account } from './../../shared/account.model';
import { Subscription } from 'rxjs';
import { AccountService } from './../../shared/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {
  total: number;
  accSub: Subscription;
  mainSub: Subscription;
  main: Account;
  accs: {[s: string]: Account};

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accSub = this.accountService.accountsChanged.subscribe((accounts: {[s: string]: Account}) => {
      this.setTotal(accounts);
      this.accs = accounts;
    });
    this.mainSub = this.accountService.mainChanged.subscribe((account) => {
      this.main = account;
    });
    this.main = this.accountService.getMain();
    this.setTotal(this.accountService.getAccounts());
    this.accs = this.accountService.getAccounts();
  }

  public getCheckingAccounts(): number {
    let count = 0;
    for (const id in this.accs) {
      if (this.accs[id].type === AccountType.Checking) {
        count += 1;
      }
    }
    return count;
  }

  public getCheckingAmount(): string {
    let amount = 0;
    for (const id in this.accs) {
      if (this.accs[id].type === AccountType.Checking) {
        amount += this.accs[id].balance;
      }
    }
    return amount.toFixed(2);
  }

  public getSavingAccounts(): number {
    let count = 0;
    for (const id in this.accs) {
      if (this.accs[id].type === AccountType.Savings) {
        count += 1;
      }
    }
    return count;
  }

  public getSavingsAmount(): string {
    let amount = 0;
    for (const id in this.accs) {
      if (this.accs[id].type === AccountType.Savings) {
        amount += this.accs[id].balance;
      }
    }
    return amount.toFixed(2);
  }

  public getCC(): number {
    let count = 0;
    for (const id in this.accs) {
      if (this.accs[id].type === AccountType.CC) {
        count += 1;
      }
    }
    return count;
  }

  public getCCAmount(): string {
    let amount = 0;
    for (const id in this.accs) {
      if (this.accs[id].type === AccountType.CC) {
        amount += this.accs[id].balance;
      }
    }
    return amount.toFixed(2);
  }

  private setTotal(accs: {[s: string]: Account}): void {
    this.total = 0;
    for (const id in accs) {
      if (Object.prototype.hasOwnProperty.call(accs, id)) {
        const acc = accs[id];
        if (acc.type !== 'CC') {
          this.total += acc.balance;
        }
        else {
          this.total -= acc.balance;
        }
      }
    }
    this.total = Number(this.total.toFixed(2));
  }

  ngOnDestroy(): void {
    this.accSub.unsubscribe();
    this.mainSub.unsubscribe();
  }
}
