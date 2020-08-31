import { Account } from './../../shared/account.model';
import { Subscription } from 'rxjs';
import { AccountService } from './../../shared/account.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  total: number;
  accSub: Subscription;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.accountsChanged.subscribe((accounts: Account[]) => {
      this.setTotal(accounts);
    });
    this.setTotal(this.accountService.getAccounts());
  }

  private setTotal(accs: Account[]): void {
    this.total = 0;
    accs.forEach((acc) => {
      if (acc.type !== 'CC') {
        this.total += acc.balance;
      }
      else {
        this.total -= acc.balance;
      }
    });
    this.total = Number(this.total.toFixed(2));
  }

}
