import { Subscription } from 'rxjs';
import { BudgetService } from './../../../shared/budget.service';
import { DataStorageService } from './../../../shared/data-storage.service';
import { AccountService } from 'src/app/shared/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Category } from 'src/app/shared/category.model';

@Component({
  selector: 'app-transaction-new',
  templateUrl: './transaction-new.component.html',
  styleUrls: ['./transaction-new.component.css']
})
export class TransactionNewComponent implements OnInit, OnDestroy {
  transactionForm: FormGroup;
  catSub: Subscription;
  categories: { [s: string]: string }[];

  constructor(private accountService: AccountService, private router: Router,
              private route: ActivatedRoute, private db: DataStorageService, private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.catSub = this.budgetService.catChanged.subscribe((cats: { [s: string]: Category }) => {
      this.categories = [];
      for (const id in cats) {
        if (Object.prototype.hasOwnProperty.call(cats, id)) {
          const cat = cats[id];
          this.categories.push({ name: cat.name, id: cat.id });
        }
      }
    });
    this.transactionForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      date: new FormControl(new Date().toLocaleDateString('en-CA')),
      description: new FormControl(null),
      amount: new FormControl(0, [Validators.required, Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?))$/),
      Validators.min(0.01)]),
      type: new FormControl('-', Validators.required),
      category: new FormControl(null)
    });
    this.categories = [];
    const categories = this.budgetService.getCategories();
    for (const id in categories) {
      if (Object.prototype.hasOwnProperty.call(categories, id)) {
        const cat = categories[id];
        this.categories.push({ name: cat.name, id: cat.id });
      }
    }
  }

  onSubmit(): void {
    this.transactionForm.value.amount = Number(this.transactionForm.value.amount);
    const accID = this.route.snapshot.params.id;
    this.accountService.addTransaction(accID, this.transactionForm.value);
    this.db.updateTransactions(accID);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  public getTypes(): string[] {
    return ['+', '-'];
  }

  public onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.catSub.unsubscribe();
  }
}
