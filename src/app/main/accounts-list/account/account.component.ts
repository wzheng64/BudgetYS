import { Account } from './../../../shared/account.model';
import { Component, OnInit, Input, } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @Input() account: Account;
  @Input() index: number;

  constructor() { }

  ngOnInit(): void {
  }

  public formatType(): string {
    if (this.account.type === 'CC') {
      return 'Credit Card';
    }
    else {
      return `${this.account.type} Account`;
    }
  }

  public formatBalance(): string {
    return this.account.balance.toFixed(2);
  }
}
