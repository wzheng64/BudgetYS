import { AccountService } from './../../shared/account.service';
import { Subscription } from 'rxjs';
import { Income } from './../../shared/income.model';
import { BudgetService } from './../../shared/budget.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-income-display',
  templateUrl: './income-display.component.html',
  styleUrls: ['./income-display.component.css']
})
export class IncomeDisplayComponent implements OnInit, OnDestroy {

  income: Income;
  incSub: Subscription;
  accounts = [];
  mainAccount: string;
  leftover: number;

  constructor(private budgetService: BudgetService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.incSub = this.budgetService.incomeChanged.subscribe((inc: Income) => {
      this.income = inc;
      this.accountsFormat(this.income);
    });
    this.income = this.budgetService.getIncome();
    this.accountsFormat(this.income);
  }

  periodFormat(period: string): string {
    if (period === 'Weekly') {
      return 'week';
    }
    else if (period === 'Bi-Weekly') {
      return '2 weeks';
    }
    else {
      return 'month';
    }
  }

  private accountsFormat(income: Income): void {
    let money = income.income;
    income.accounts.forEach((acc) => {
      money -= acc.proportion;
      this.accounts.push({
        ...acc,
        name: this.accountService.getAccountById(acc.accountID).name
      });
    });
    this.mainAccount = this.accountService.getAccountById(income.remainder).name;
    this.leftover = money;
  }

  ngOnDestroy(): void {
    this.incSub.unsubscribe();
  }

}
