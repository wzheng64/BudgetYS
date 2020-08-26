import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/shared/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {
  transactions: Transaction[];
  transSub: Subscription;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.transSub = this.accountService.transactionsChanged.subscribe((trans: Transaction[]) => {
      this.transactions = trans;
    });
  }

  ngOnDestroy(): void {
    this.transSub.unsubscribe();
  }
}
