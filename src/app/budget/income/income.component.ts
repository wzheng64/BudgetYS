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
    this.currentPeriod = this.income.period;
  }

  onChangeIncome(): void {
    this.router.navigate(['income'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.incomeSub.unsubscribe();
  }
}
