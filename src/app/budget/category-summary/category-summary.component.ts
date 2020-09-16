import { HelperService } from './../../shared/helper.service';
import { BudgetService } from 'src/app/shared/budget.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from 'src/app/shared/category.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.css']
})
export class CategorySummaryComponent implements OnInit, OnDestroy {
  categories: {[s: string]: Category};
  selectedPeriod: string;
  currentDateRange: string;
  categorySub: Subscription;
  periodSub: Subscription;
  today: string = new Date().toLocaleString('sv-SE').split(' ')[0];

  constructor(private budgetService: BudgetService, private help: HelperService) { }

  ngOnInit(): void {
    console.log(this.today);
    this.categorySub = this.budgetService.catChanged.subscribe((categories: {[s: string]: Category}) => {
      this.categories = categories;
    });
    this.periodSub = this.budgetService.currentPeriodChanged.subscribe((period: string) => {
      this.selectedPeriod = period;
      this.currentDateRange = this.setDateRange(new Date());
    });
    this.categories = this.budgetService.getCategories();
    this.selectedPeriod = this.budgetService.getCurrentPeriod();
    this.currentDateRange = this.setDateRange(new Date());
  }

  getTotal(): number {
    let total = 0;

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
      dateString = beginningOfWeek.getUTCMonth() + 1  + '/' + beginningOfWeek.getUTCDate() + '/' + beginningOfWeek.getUTCFullYear()
                   + ' - ' + (endOfWeek.getUTCMonth() + 1)  + '/' + endOfWeek.getUTCDate() + '/' + endOfWeek.getUTCFullYear();
    }
    else {
      const selectedDate = new Date(date);
      const beginningOfMonth = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth()));
      const endOfMonth = new Date(Date.UTC(beginningOfMonth.getUTCFullYear(), beginningOfMonth.getUTCMonth() + 1));
      dateString = beginningOfMonth.getUTCMonth() + 1  + '/' + beginningOfMonth.getUTCDate() + '/' + beginningOfMonth.getUTCFullYear()
      + ' - ' + (endOfMonth.getUTCMonth() + 1)  + '/' + endOfMonth.getUTCDate() + '/' + endOfMonth.getUTCFullYear();
    }
    console.log(this.selectedPeriod);
    console.log(dateString);
    return dateString;
  }

  changeDate(date: string): void {
    this.currentDateRange = this.setDateRange(date);
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
    this.periodSub.unsubscribe();
  }
}
