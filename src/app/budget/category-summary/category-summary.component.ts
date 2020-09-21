import { HelperService } from './../../shared/helper.service';
import { BudgetService } from 'src/app/shared/budget.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from 'src/app/shared/category.model';
import { Subscription } from 'rxjs';
import { Transaction } from 'src/app/shared/transaction.model';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.css']
})
export class CategorySummaryComponent implements OnInit, OnDestroy {
  categories: { [s: string]: Category };
  selectedPeriod: string;
  currentDateRange: string;
  categorySub: Subscription;
  periodSub: Subscription;
  selectedDate: string;
  workingCategories: { [categoryid: string]: { [week: number]: Transaction[] } };
  graphData: {
    numbers: number[],
    labels: Label[],
    colors: { backgroundColor: string[] },
    options: ChartOptions
  };
  topFive: Transaction[];

  constructor(private budgetService: BudgetService, private help: HelperService) { }

  ngOnInit(): void {
    this.categorySub = this.budgetService.catChanged.subscribe((categories: { [s: string]: Category }) => {
      this.categories = categories;
    });
    this.periodSub = this.budgetService.currentPeriodChanged.subscribe((period: string) => {
      this.selectedPeriod = period;
      if (localStorage.getItem('selectedDate')) {
        this.currentDateRange = this.setDateRange(localStorage.getItem('selectedDate'));
      }
      else {
        this.currentDateRange = this.setDateRange(new Date());
      }
    });
    this.categories = this.budgetService.getCategories();
    this.selectedPeriod = this.budgetService.getCurrentPeriod();
    if (localStorage.getItem('selectedDate')) {
      this.currentDateRange = this.setDateRange(localStorage.getItem('selectedDate'));
      this.selectedDate = localStorage.getItem('selectedDate');
    }
    else {
      this.currentDateRange = this.setDateRange(new Date());
      this.selectedDate = new Date().toLocaleString('sv-SE').split(' ')[0];
    }
  }

  getTotalSpent(): number {
    let total = 0;
    for (const categoryid in this.workingCategories) {
      if (Object.prototype.hasOwnProperty.call(this.workingCategories, categoryid)) {
        for (const week in this.workingCategories[categoryid]) {
          if (Object.prototype.hasOwnProperty.call(this.workingCategories[categoryid], week)) {
            this.workingCategories[categoryid][week].forEach((transaction: Transaction) => {
              total += transaction.amount;
            });
          }
        }
      }
    }
    return total;
  }

  getTotalBudget(): number {
    let total = 0;
    for (const categoryid in this.categories) {
      if (Object.prototype.hasOwnProperty.call(this.categories, categoryid)) {
        total += this.categories[categoryid].amount * this.help.periodRatio(this.selectedPeriod, this.categories[categoryid].period);
      }
    }
    return total;
  }

  setDateRange(date: Date | string): string {
    let dateString = '';
    if (this.selectedPeriod === 'Weekly') {
      const week = this.help.getWeek(date);
      const beginningOfWeek = new Date(week);
      const endOfWeek = new Date(week + 518400000);
      dateString = beginningOfWeek.getUTCMonth() + 1 + '/' + beginningOfWeek.getUTCDate() + '/' + beginningOfWeek.getUTCFullYear()
        + ' - ' + (endOfWeek.getUTCMonth() + 1) + '/' + endOfWeek.getUTCDate() + '/' + endOfWeek.getUTCFullYear();
    }
    else if (this.selectedPeriod === 'Bi-Weekly') {
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
    this.getTransactions(date);
    this.setPieChart();
    this.getTopFive();
    return dateString;
  }

  changeDate(date: string): void {
    this.currentDateRange = this.setDateRange(date);
    localStorage.setItem('selectedDate', date);
  }

  // This method will use the current date period to get all transactions that fall within this date
  private getTransactions(date: string | Date): void {
    this.workingCategories = {};
    // Only need to get the one week's worth of transaction
    if (this.selectedPeriod === 'Weekly') {
      const week = this.help.getWeek(date);
      for (const categoryid in this.categories) {
        if (Object.prototype.hasOwnProperty.call(this.categories, categoryid)) {
          const transactions = this.categories[categoryid].transactions;
          this.workingCategories[categoryid] = {};
          if (transactions && transactions !== undefined && Object.keys(transactions).length > 0) {
            if (Object.prototype.hasOwnProperty.call(transactions, week)) {
              if (!Object.prototype.hasOwnProperty.call(this.workingCategories[categoryid], week)) {
                this.workingCategories[categoryid][week] = [];
              }
              for (const transactionid in transactions[week]) {
                if (Object.prototype.hasOwnProperty.call(transactions[week], transactionid)) {
                  this.workingCategories[categoryid][week].push(transactions[week][transactionid]);
                }
              }
            }
          }
        }
      }
    }
    else if (this.selectedPeriod === 'Bi-Weekly') {
      const week = this.help.getWeek(date);
      const week2 = week + 604800000;
      for (const categoryid in this.categories) { // For every category
        if (Object.prototype.hasOwnProperty.call(this.categories, categoryid)) {
          const transactions = this.categories[categoryid].transactions; // Grab the transactions of that category
          this.workingCategories[categoryid] = {}; // Create an empty object to store transactions
          if (transactions && transactions !== undefined && Object.keys(transactions).length > 0) { // Make sure there are transactions
            if (Object.prototype.hasOwnProperty.call(transactions, week)) {
              if (!Object.prototype.hasOwnProperty.call(this.workingCategories[categoryid], week)) {
                this.workingCategories[categoryid][week] = [];
              }
              for (const transactionid in transactions[week]) {
                if (Object.prototype.hasOwnProperty.call(transactions[week], transactionid)) {
                  this.workingCategories[categoryid][week].push(transactions[week][transactionid]);
                }
              }
            }
            // Grabbing transactions for the second week as well
            if (Object.prototype.hasOwnProperty.call(transactions, week2)) {
              if (!Object.prototype.hasOwnProperty.call(this.workingCategories[categoryid], week2)) {
                this.workingCategories[categoryid][week2] = [];
              }
              for (const transactionid in transactions[week2]) {
                if (Object.prototype.hasOwnProperty.call(transactions[week2], transactionid)) {
                  this.workingCategories[categoryid][week2].push(transactions[week2][transactionid]);
                }
              }
            }
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
      for (const categoryid in this.categories) { // For every category
        if (Object.prototype.hasOwnProperty.call(this.categories, categoryid)) {
          const transactions = this.categories[categoryid].transactions; // Grab the transactions of that category
          this.workingCategories[categoryid] = {}; // Create an empty object to store transactions
          if (transactions && transactions !== undefined && Object.keys(transactions).length > 0) { // Make sure there are transactions
            let week = weeks[0];
            if (Object.prototype.hasOwnProperty.call(transactions, week)) {
              if (!Object.prototype.hasOwnProperty.call(this.workingCategories[categoryid], week)) {
                this.workingCategories[categoryid][week] = [];
              }
              for (const transactionid in transactions[week]) {
                if (Object.prototype.hasOwnProperty.call(transactions[week], transactionid)) {
                  const transaction = transactions[week][transactionid];
                  const transactionDate = Date.UTC(new Date(transaction.date).getUTCFullYear(),
                    new Date(transaction.date).getUTCMonth(),
                    new Date(transaction.date).getUTCDate());
                  if (transactionDate >= beginningOfMonthms) {
                    this.workingCategories[categoryid][week].push(transactions[week][transactionid]);
                  }
                }
              }
            }
            for (let index = 1; index < weeks.length - 1; index++) {
              week = weeks[index];
              if (Object.prototype.hasOwnProperty.call(transactions, week)) {
                if (!Object.prototype.hasOwnProperty.call(this.workingCategories[categoryid], week)) {
                  this.workingCategories[categoryid][week] = [];
                }
                for (const transactionid in transactions[week]) {
                  if (Object.prototype.hasOwnProperty.call(transactions[week], transactionid)) {
                    this.workingCategories[categoryid][week].push(transactions[week][transactionid]);
                  }
                }
              }
            }
            week = weeks[weeks.length - 1];
            if (Object.prototype.hasOwnProperty.call(transactions, week)) {
              if (!Object.prototype.hasOwnProperty.call(this.workingCategories[categoryid], week)) {
                this.workingCategories[categoryid][week] = [];
              }
              for (const transactionid in transactions[week]) {
                if (Object.prototype.hasOwnProperty.call(transactions[week], transactionid)) {
                  const transaction = transactions[week][transactionid];
                  const transactionDate = Date.UTC(new Date(transaction.date).getUTCFullYear(),
                    new Date(transaction.date).getUTCMonth(),
                    new Date(transaction.date).getUTCDate());
                  if (transactionDate < endOfMonthms) {
                    this.workingCategories[categoryid][week].push(transactions[week][transactionid]);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private setPieChart(): void {
    this.graphData = {
      numbers: [],
      labels: [],
      colors: { backgroundColor: [] },
      options: {}
    };
    for (const categoryid in this.workingCategories) {
      if (Object.prototype.hasOwnProperty.call(this.workingCategories, categoryid)) {
        // Get the amount spent in that category
        let totalSpent = 0;
        const category = this.workingCategories[categoryid];
        for (const week in category) {
          if (Object.prototype.hasOwnProperty.call(category, week)) {
            const transactions = category[week];
            transactions.forEach((transaction: Transaction) => {
              totalSpent += transaction.amount;
            });
          }
        }
        this.graphData.numbers.push(totalSpent);
        // Get the name for the label
        this.graphData.labels.push(this.categories[categoryid].name);
      }
    }
  }

  private getTopFive(): void {
    const transactions: Transaction[] = [];
    for (const categoryid in this.workingCategories) {
      if (Object.prototype.hasOwnProperty.call(this.workingCategories, categoryid)) {
        for (const week in this.workingCategories[categoryid]) {
          if (Object.prototype.hasOwnProperty.call(this.workingCategories[categoryid], week)) {
            this.workingCategories[categoryid][week].forEach((transaction: Transaction) => {
              transactions.push(transaction);
            });
          }
        }
      }
    }
    transactions.sort((a, b) => b.amount - a.amount);
    this.topFive = transactions.slice(0, 5);
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
    this.periodSub.unsubscribe();
  }
}
