import { BudgetService } from 'src/app/shared/budget.service';
import { Category } from 'src/app/shared/category.model';
import { Transaction } from 'src/app/shared/transaction.model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/shared/account.service';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchService } from 'src/app/shared/search.service';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-category-transactions-list',
  templateUrl: './category-transactions-list.component.html',
  styleUrls: ['./category-transactions-list.component.css']
})
export class CategoryTransactionsListComponent implements OnInit, OnDestroy {
  selectedDate: string;
  category: Category;
  transactions: Transaction[];
  workingTransactions: Transaction[];
  currentTransactions: Transaction[];
  searchSub: Subscription;
  sortSub: Subscription;
  dateSub: Subscription;
  searchData: { search: string, sortString: string };
  pages: number[];
  lengthOfLists = 7;
  id: string;

  constructor(private accountService: AccountService, private route: ActivatedRoute, private searchService: SearchService,
              private help: HelperService, private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if ('categoryid' in params) {
        this.workingTransactions = [];
        this.id = params.categoryid;
        this.category = this.budgetService.getCategory(this.id);
        this.searchData = JSON.parse(localStorage.getItem(params.accountid + '-searchData'));
        if (!this.searchData) {
          this.searchData = { search: '', sortString: ''};
        }
        if (localStorage.getItem(`${this.id}-selection`)) {
          this.selectedDate = localStorage.getItem(`${this.id}-selection`);
        }
        else {
          this.selectedDate = new Date().toLocaleString('sv-SE').split(' ')[0];
        }
        this.transactions = this.getTransactions(this.selectedDate);
        this.workingTransactions = this.transactions;
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
    this.dateSub = this.searchService.categoryDateChanged.subscribe((transactions: Transaction[]) => {
      this.transactions = transactions;
      this.workingTransactions = [];
      this.transactions.forEach((transaction: Transaction) => {
        if (transaction.name.includes(this.searchData.search) || transaction.description.includes(this.searchData.search)) {
          this.workingTransactions.push(transaction);
        }
      });
      this.sortTransactions(this.searchData.sortString);
      this.createPages();
      this.changePage(1);
    });
  }

  changePage(n: number): void {
    this.currentTransactions = this.workingTransactions.slice((this.lengthOfLists * (n - 1)),
      ((this.lengthOfLists * (n - 1)) + this.lengthOfLists));
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

  private getTransactions(date: string | Date): Transaction[] {
    const transactions = [];
    // Only need to get the one week's worth of transaction
    if (this.category.period === 'Week') {
      const week = this.help.getWeek(date);
      if (Object.prototype.hasOwnProperty.call(this.category.transactions, week)) {
        for (const transactionid in this.category.transactions[week]) {
          if (Object.prototype.hasOwnProperty.call(this.category.transactions[week], transactionid)) {
            transactions.push(this.category.transactions[week][transactionid]);
          }
        }
      }
    }
    else if (this.category.period === '2 Weeks') {
      const week = this.help.getWeek(date);
      const week2 = week + 604800000;
      if (Object.prototype.hasOwnProperty.call(this.category.transactions, week)) {
        for (const transactionid in this.category.transactions[week]) {
          if (Object.prototype.hasOwnProperty.call(this.category.transactions[week], transactionid)) {
            transactions.push(this.category.transactions[week][transactionid]);
          }
        }
      }
      if (Object.prototype.hasOwnProperty.call(this.category.transactions, week2)) {
        for (const transactionid in this.category.transactions[week2]) {
          if (Object.prototype.hasOwnProperty.call(this.category.transactions[week2], transactionid)) {
            transactions.push(this.category.transactions[week2][transactionid]);
          }
        }
      }
    }
    else {
      const selectedDate = new Date(date);
      const beginningOfMonth = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth()));
      const endOfMonth = new Date(Date.UTC(beginningOfMonth.getUTCFullYear(), beginningOfMonth.getUTCMonth() + 1));
      const week1 = this.help.getWeek(beginningOfMonth);
      const lastWeek = this.help.getWeek(endOfMonth);
      const weeks = [week1];
      for (let index = 1; index < 6; index++) {
        weeks.push(week1 + 604800000 * index);
      }
      if (weeks[weeks.length - 1] !== lastWeek) {
        weeks.pop();
      }
      const beginningOfMonthms = Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth());
      const endOfMonthms = Date.UTC(beginningOfMonth.getUTCFullYear(), beginningOfMonth.getUTCMonth() + 1);
      let week = weeks[0];
      if (Object.prototype.hasOwnProperty.call(this.category.transactions, week)) {
        for (const transactionid in this.category.transactions[week]) {
          if (Object.prototype.hasOwnProperty.call(this.category.transactions[week], transactionid)) {
            const transaction = this.category.transactions[week][transactionid];
            const transactionDate = Date.UTC(new Date(transaction.date).getUTCFullYear(),
              new Date(transaction.date).getUTCMonth(),
              new Date(transaction.date).getUTCDate());
            if (transactionDate >= beginningOfMonthms) {
              transactions.push(this.category.transactions[week][transactionid]);
            }
          }
        }
      }
      for (let index = 1; index < weeks.length - 1; index++) {
        week = weeks[index];
        if (Object.prototype.hasOwnProperty.call(this.category.transactions, week)) {
          for (const transactionid in this.category.transactions[week]) {
            if (Object.prototype.hasOwnProperty.call(this.category.transactions[week], transactionid)) {
              transactions.push(this.category.transactions[week][transactionid]);
            }
          }
        }
      }
      week = weeks[weeks.length - 1];
      if (Object.prototype.hasOwnProperty.call(this.category.transactions, week)) {
        for (const transactionid in this.category.transactions[week]) {
          if (Object.prototype.hasOwnProperty.call(this.category.transactions[week], transactionid)) {
            const transaction = this.category.transactions[week][transactionid];
            const transactionDate = Date.UTC(new Date(transaction.date).getUTCFullYear(),
              new Date(transaction.date).getUTCMonth(),
              new Date(transaction.date).getUTCDate());
            if (transactionDate < endOfMonthms) {
              transactions.push(this.category.transactions[week][transactionid]);
            }
          }
        }
      }
    }
    return transactions;
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
    this.sortSub.unsubscribe();
    this.dateSub.unsubscribe();
  }
}
