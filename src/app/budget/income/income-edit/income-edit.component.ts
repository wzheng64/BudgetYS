import { DataStorageService } from './../../../shared/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/shared/account.service';
import { BudgetService } from './../../../shared/budget.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { Income } from 'src/app/shared/income.model';

@Component({
  selector: 'app-income-edit',
  templateUrl: './income-edit.component.html',
  styleUrls: ['./income-edit.component.css']
})
export class IncomeEditComponent implements OnInit {

  incomeForm: FormGroup;
  periods = this.budgetService.getPeriods();
  income: Income;

  constructor(private budgetService: BudgetService, private accountService: AccountService,
              private route: ActivatedRoute, private router: Router, private db: DataStorageService) { }

  ngOnInit(): void {
    this.income = this.budgetService.getIncome();
    if (Object.keys(this.income).length) {
      const accs = new FormArray([]);
      this.income.accounts.forEach((acc) => {
        accs.push(new FormGroup({
          accountID: new FormControl(acc.accountID, Validators.required),
          proportion: new FormControl(acc.proportion, [Validators.required,
          Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?)|0|0.00)$/)])
        }));
      });
      this.incomeForm = new FormGroup({
        income: new FormControl(this.income.income, [Validators.required, Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?)|0|0.00)$/)]),
        period: new FormControl(this.income.period, Validators.required),
        accounts: accs,
        remainder: new FormControl(this.income.remainder, Validators.required),
        lastPayDate: new FormControl(this.income.lastPayDate, Validators.required),
      });
    }
    else {
      this.incomeForm = new FormGroup({
        income: new FormControl(null, [Validators.required, Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?)|0|0.00)$/)]),
        period: new FormControl('Weekly', Validators.required),
        accounts: new FormArray([]),
        remainder: new FormControl(null, Validators.required),
        lastPayDate: new FormControl(null, Validators.required),
      });
    }
  }

  onAddAccount(): void {
    (this.incomeForm.get('accounts') as FormArray).push(
      new FormGroup({
        accountID: new FormControl(null, Validators.required),
        proportion: new FormControl(null, [Validators.required,
        Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?)|0|0.00)$/)])
      })
    );
  }

  onDeleteAccount(index: number): void {
    (this.incomeForm.get('accounts') as FormArray).removeAt(index);
  }

  onSubmit(): void {
    this.budgetService.setIncome(this.incomeForm.value);
    this.db.updateIncome(this.incomeForm.value);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get accountsControl(): AbstractControl[] {
    return (this.incomeForm.get('accounts') as FormArray).controls;
  }

  get accounts(): Account[] {
    const names = [];
    const accs = this.accountService.getAccounts();
    for (const id in accs) {
      if (Object.prototype.hasOwnProperty.call(accs, id) && accs[id].type !== 'CC') {
        names.push(accs[id]);
      }
    }
    return names;
  }
}
