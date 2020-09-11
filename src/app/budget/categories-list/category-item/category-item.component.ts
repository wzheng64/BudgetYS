import { Subscription } from 'rxjs';
import { BudgetService } from './../../../shared/budget.service';
import { Category } from './../../../shared/category.model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css']
})
export class CategoryItemComponent implements OnInit, OnDestroy {
  @Input() category: Category;
  @Input() id: string;
  currentPeriod: string;
  currentPeriodSub: Subscription;

  constructor(private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.currentPeriodSub = this.budgetService.currentPeriodChanged.subscribe((s: string) => {
      this.currentPeriod = s;
    });
    this.currentPeriod = this.budgetService.getCurrentPeriod();
  }

  formatAmount(): string {
    const period = this.category.period;
    let num = 0;
    let den = 0;
    if (period === 'Week') {
      den = 1;
    }
    else if (period === '2 weeks') {
      den = 2;
    }
    else if (period === 'Month') {
      den = 4;
    }
    if (this.currentPeriod === 'Weekly') {
      num = 1;
    }
    else if (this.currentPeriod === 'Bi-Weekly') {
      num = 2;
    }
    else if (this.currentPeriod === 'Monthly') {
      num = 4;
    }
    return (this.category.amount * (num / den)).toFixed(2);
  }

  formatPeriod(): string {
    if (this.currentPeriod === 'Weekly') {
      return 'week';
    }
    else if (this.currentPeriod === 'Bi-Weekly') {
      return '2 weeks';
    }
    else {
      return 'month';
    }
  }

  ngOnDestroy(): void {
    this.currentPeriodSub.unsubscribe();
  }
}
