import { HelperService } from './../../../shared/helper.service';
import { SearchService } from './../../../shared/search.service';
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
  @Input() transactions: Transaction[];
  workingTransactions: Transaction[];
  currentTransactions: Transaction[];
  transSub: Subscription;
  searchSub: Subscription;
  sortSub: Subscription;
  dateRangeSub: Subscription;
  searchData: { search: string, begindate: string, enddate: string, sortString: string };
  pages: number[];
  lengthOfLists = 12;
  id: string;

  constructor(private accountService: AccountService, private route: ActivatedRoute, private searchService: SearchService,
              private help: HelperService) { }

  ngOnInit(): void {
    this.transSub = this.accountService.transactionsChanged.subscribe((trans: { [date: number]: { [s: string]: Transaction } }) => {
      this.loadTransactions(trans);
      this.createPages();
      this.changePage(1);
    });
    this.route.params.subscribe((params: Params) => {
      if ('accountid' in params) {
        this.id = params.accountid;
        this.searchData = JSON.parse(localStorage.getItem(params.accountid + '-searchData'));
        if (this.searchData.begindate && this.searchData.enddate) {
          this.loadTransactions(this.accountService.getTransactions(this.id), this.searchData.begindate, this.searchData.enddate);
        }
        else {
          this.loadTransactions(this.accountService.getTransactions(params.accountid));
        }
        this.workingTransactions = this.transactions;
        if (this.searchData.search) {
          this.workingTransactions = [];
          this.transactions.forEach((transaction: Transaction) => {
            if (transaction.name.includes(this.searchData.search) || transaction.description.includes(this.searchData.search)) {
              this.workingTransactions.push(transaction);
            }
          });
        }
        if (this.searchData.sortString) {
          this.sortTransactions(this.searchData.sortString);
        }
        this.createPages();
        this.changePage(1);
      }
    });
    this.searchSub = this.searchService.searchChanged.subscribe((searchString: string) => {
      this.searchData.search = searchString;
      this.workingTransactions = [];
      this.transactions.forEach((transaction: Transaction) => {
        if (transaction.name.includes(searchString) || transaction.description.includes(searchString)) {
          this.workingTransactions.push(transaction);
        }
      });
      this.createPages();
      this.changePage(1);
    });
    this.sortSub = this.searchService.sortChanged.subscribe((sortString: string) => {
      this.searchData.sortString = sortString;
      this.sortTransactions(sortString);
      this.createPages();
      this.changePage(1);
    });
    this.dateRangeSub = this.searchService.dateChanged.subscribe((dates: string[]) => {
      this.searchData.begindate = dates[0];
      this.searchData.enddate = dates[1];
      this.loadTransactions(this.accountService.getTransactions(this.id), this.searchData.begindate, this.searchData.enddate);
      this.workingTransactions = [];
      this.transactions.forEach((transaction: Transaction) => {
        if (transaction.name.includes(this.searchData.search) || transaction.description.includes(this.searchData.search)) {
          this.workingTransactions.push(transaction);
        }
      });
      console.log(this.workingTransactions);
      this.sortTransactions(this.searchData.sortString);
      this.createPages();
      this.changePage(1);
    });
  }

  changePage(n: number): void {
    this.currentTransactions = this.workingTransactions.slice((this.lengthOfLists * (n - 1)),
      ((this.lengthOfLists * (n - 1)) + this.lengthOfLists));
  }

  private loadTransactions(transactions: { [date: number]: { [s: string]: Transaction } }, beginDate?: string, endDate?: string): void {
    this.transactions = [];
    const accountTransactions = this.accountService.getTransactions(this.id);
    if (beginDate && endDate) {
      let beginWeek = this.help.getWeek(beginDate);
      const endWeek = this.help.getWeek(endDate);
      const weeks = [beginWeek];
      if (beginWeek !== endWeek) {
        while (endWeek >= beginWeek) {
          beginWeek += 604800000;
          weeks.push(beginWeek);
        }
      }
      let week = weeks[0];
      if (Object.prototype.hasOwnProperty.call(accountTransactions, week)) {
        for (const transactionid in accountTransactions[week]) {
          if (Object.prototype.hasOwnProperty.call(accountTransactions[week], transactionid)) {
            const transaction = accountTransactions[week][transactionid];
            if (transaction.date >= beginDate && transaction.date <= endDate) {
              this.transactions.push(transaction);
            }
          }
        }
      }
      for (let index = 1; index < weeks.length - 1; index++) {
        week = weeks[index];
        if (Object.prototype.hasOwnProperty.call(accountTransactions, week)) {
          for (const transactionid in accountTransactions[week]) {
            if (Object.prototype.hasOwnProperty.call(accountTransactions[week], transactionid)) {
              this.transactions.push(accountTransactions[week][transactionid]);
            }
          }
        }
      }
      week = weeks[weeks.length - 1];
      if (weeks.length !== 1) {
        if (Object.prototype.hasOwnProperty.call(accountTransactions, week)) {
          for (const transactionid in accountTransactions[week]) {
            if (Object.prototype.hasOwnProperty.call(accountTransactions[week], transactionid)) {
              const transaction = accountTransactions[week][transactionid];
              if (transaction.date >= beginDate && transaction.date <= endDate) {
                this.transactions.push(transaction);
              }
            }
          }
        }
      }
    }
    else {
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
  }

  private createPages(): void {
    this.pages = [];
    const numPages = Math.ceil(this.workingTransactions.length / this.lengthOfLists);
    let i = 1;
    while (i <= numPages) {
      this.pages.push(i);
      i++;
    }
  }

  private sortTransactions(sortString: string): void {
    console.log(sortString);
    if (sortString === 'Name (A-Z)') {
      this.workingTransactions.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    }
    else if (sortString === 'Name (Z-A)') {
      this.workingTransactions.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1);
    }
    else if (sortString === 'Date (Most Recent)') {
      this.workingTransactions.sort((a, b) => {
        return a.date.toLowerCase() > b.date.toLowerCase() ? -1 : 1;
      });
    }
    else if (sortString === 'Date (Least Recent)') {
      this.workingTransactions.sort((a, b) => {
        return a.date.toLowerCase() > b.date.toLowerCase() ? 1 : -1;
      });
    }
    else {
      const positives = this.workingTransactions.filter((transaction) => transaction.type === '+');
      const negatives = this.workingTransactions.filter((transaction) => transaction.type === '-');
      if (sortString === '+Amount (Big-Small)') {
        positives.sort((a, b) => {
          return b.amount - a.amount;
        });
        negatives.sort((a, b) => {
          return b.amount - a.amount;
        });
        this.workingTransactions = positives.concat(negatives);
      }
      else if (sortString === '+Amount (Small-Big)') {
        positives.sort((a, b) => {
          return a.amount - b.amount;
        });
        negatives.sort((a, b) => {
          return a.amount - b.amount;
        });
        this.workingTransactions = positives.concat(negatives);
      }
      else if (sortString === '-Amount (Big-Small)') {
        positives.sort((a, b) => {
          return b.amount - a.amount;
        });
        negatives.sort((a, b) => {
          return b.amount - a.amount;
        });
        this.workingTransactions = negatives.concat(positives);
      }
      else {
        positives.sort((a, b) => {
          return a.amount - b.amount;
        });
        negatives.sort((a, b) => {
          return a.amount - b.amount;
        });
        this.workingTransactions = negatives.concat(positives);
      }
    }
  }

  ngOnDestroy(): void {
    this.transSub.unsubscribe();
    this.searchSub.unsubscribe();
    this.sortSub.unsubscribe();
    this.dateRangeSub.unsubscribe();
  }
}
