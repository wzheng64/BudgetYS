import { HttpEvent } from '@angular/common/http';
import { Income } from './../../shared/income.model';
import { Subscription } from 'rxjs';
import { BudgetService } from './../../shared/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit, OnDestroy {
  income: Income;
  periods = this.budgetService.getPeriods();
  currentPeriod: string;
  incomeSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,
              private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.incomeSub = this.budgetService.incomeChanged.subscribe((income: Income) => {
      this.income = income;
    });
    this.income = this.budgetService.getIncome();
    if (localStorage.getItem('currentPeriod')) {
      this.currentPeriod = localStorage.getItem('currentPeriod');
      this.budgetService.setCurrentPeriod(this.currentPeriod);
    }
    else {
      this.currentPeriod = this.income.period;
    }
  }

  onChangeIncome(): void {
    this.router.navigate(['income'], {relativeTo: this.route});
  }

  onPeriodChange(event): void {
    localStorage.setItem('currentPeriod', event.target.value);
    this.budgetService.setCurrentPeriod(event.target.value);
  }

  formatIncome(): number {
    const period = this.income.period;
    let num = 0;
    let den = 0;
    if (period === 'Weekly') {
      den = 1;
    }
    else if (period === 'Bi-Weekly') {
      den = 2;
    }
    else if (period === 'Monthly') {
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
    return this.income.income * (num / den);
  }

  ngOnDestroy(): void {
    this.incomeSub.unsubscribe();
  }
}
