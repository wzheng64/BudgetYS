import { BudgetService } from './../../shared/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {
  income = 0;
  period = 'Weekly';
  periods = this.budgetService.getPeriods();

  constructor(private route: ActivatedRoute, private router: Router,
              private budgetService: BudgetService) { }

  ngOnInit(): void {
  }

  onChangeIncome(): void {
    this.router.navigate(['income'], {relativeTo: this.route});
  }
}
