import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/shared/account.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Transaction } from 'src/app/shared/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {
  @Input()transactions: Transaction[];
  transSub: Subscription;
  pSub: Subscription;

  constructor(private accountService: AccountService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.transSub = this.accountService.transactionsChanged.subscribe((trans: {[date: number]: {[s: string]: Transaction}}) => {
      this.loadTransactions(trans);
    });
    this.pSub = this.route.params.subscribe((params: Params) => {
      if ('accountid' in params) {
        this.loadTransactions(this.accountService.getTransactions(params.accountid));
      }
    });
  }

  private loadTransactions(transactions: {[date: number]: {[s: string]: Transaction}}): void {
    this.transactions = [];
    for (const date in transactions) {
      if (Object.prototype.hasOwnProperty.call(transactions, date)) {
        const weekOfTransactions = transactions[date];
        for (const transactionID in weekOfTransactions) {
          if (Object.prototype.hasOwnProperty.call(weekOfTransactions, transactionID)) {
            const transaction = weekOfTransactions[transactionID];
            this.transactions.push(transaction);
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.transSub.unsubscribe();
    this.pSub.unsubscribe();
  }
}
