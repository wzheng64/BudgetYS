import { ActivatedRoute, Params } from '@angular/router';
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
  pSub: Subscription;

  constructor(private accountService: AccountService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.transSub = this.accountService.transactionsChanged.subscribe((trans: Transaction[]) => {
      this.transactions = trans;
    });
    this.pSub = this.route.params.subscribe((params: Params) => {
      this.transactions = this.accountService.getTransactions(params.id);
    });
  }

  ngOnDestroy(): void {
    this.transSub.unsubscribe();
    this.pSub.unsubscribe();
  }
}
