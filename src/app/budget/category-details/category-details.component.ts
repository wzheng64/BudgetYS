import { SearchService } from 'src/app/shared/search.service';
import { Subject } from 'rxjs/internal/Subject';
import { DataStorageService } from './../../shared/data-storage.service';
import { HelperService } from './../../shared/helper.service';
import { Category } from './../../shared/category.model';
import { BudgetService } from 'src/app/shared/budget.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/shared/transaction.model';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {
  categoryid: string;
  category: Category;
  currentDateRange: string;
  selectedDate: string;
  transactions: Transaction[];
  delete: boolean;
  transactionsChanged: Subject<Transaction[]>;


  constructor(private route: ActivatedRoute, private budgetService: BudgetService, private router: Router,
              private help: HelperService, private db: DataStorageService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.categoryid = params.categoryid;
      this.category = this.budgetService.getCategory(this.categoryid);
      if (localStorage.getItem(`${this.categoryid}-selection`)) {
        this.selectedDate = localStorage.getItem(`${this.categoryid}-selection`);
      }
      else {
        this.selectedDate = new Date().toLocaleString('sv-SE').split(' ')[0];
      }
      this.currentDateRange = this.setDateRange(this.selectedDate);
    });
    this.delete = false;
  }

  changeDate(date: string): void {
    this.currentDateRange = this.setDateRange(date);
    this.selectedDate = date;
    localStorage.setItem(`${this.categoryid}-selection`, date);
  }

  setDateRange(date: Date | string): string {
    let dateString = '';
    if (this.category.period === 'Week') {
      const week = this.help.getWeek(date);
      const beginningOfWeek = new Date(week);
      const endOfWeek = new Date(week + 518400000);
      dateString = beginningOfWeek.getUTCMonth() + 1 + '/' + beginningOfWeek.getUTCDate() + '/' + beginningOfWeek.getUTCFullYear()
        + ' - ' + (endOfWeek.getUTCMonth() + 1) + '/' + endOfWeek.getUTCDate() + '/' + endOfWeek.getUTCFullYear();
    }
    else if (this.category.period === '2 Weeks') {
      const week = this.help.getWeek(date);
      const beginningOfWeek = new Date(week);
      const endOfWeek = new Date(week + 1123000000);
      dateString = beginningOfWeek.getUTCMonth() + 1 + '/' + beginningOfWeek.getUTCDate() + '/' + beginningOfWeek.getUTCFullYear()
        + ' - ' + (endOfWeek.getUTCMonth() + 1) + '/' + endOfWeek.getUTCDate() + '/' + endOfWeek.getUTCFullYear();
    }
    else {
      const selectedDate = new Date(date);
      const beginningOfMonth = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth()));
      const endOfMonth = new Date(Date.UTC(beginningOfMonth.getUTCFullYear(), beginningOfMonth.getUTCMonth() + 1));
      dateString = beginningOfMonth.getUTCMonth() + 1 + '/' + beginningOfMonth.getUTCDate() + '/' + beginningOfMonth.getUTCFullYear()
        + ' - ' + (endOfMonth.getUTCMonth() + 1) + '/' + endOfMonth.getUTCDate() + '/' + endOfMonth.getUTCFullYear();
    }
    this.transactions = this.getTransactions(date);
    this.searchService.categoryDateChanged.next(this.transactions);
    return dateString;
  }

  getTotal(): number {
    let sum = 0;
    this.transactions.forEach((transaction: Transaction) => {
      sum += transaction.amount;
    });
    return sum;
  }

  onEdit(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete(): void {
    this.budgetService.deleteCategory(this.categoryid);
    this.router.navigate(['../'], {relativeTo: this.route});
    this.db.deleteCategory(this.categoryid);
  }

  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  sendTransactions(): Transaction[] {
    return this.transactions;
  }

  getTransactions(date: string | Date): Transaction[] {
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
      // Weeks should now contain all the weeks that are in the month
      // The first and last week need to be manually searched for transactions that are within the proper month
      // Millisecond representations of the first day of the month and the first day of next month
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
}
