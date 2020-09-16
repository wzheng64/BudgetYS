import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageService } from './../../../../shared/data-storage.service';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/shared/account.service';
import { Transaction } from './../../../../shared/transaction.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BudgetService } from 'src/app/shared/budget.service';
import { Category } from 'src/app/shared/category.model';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.css']
})
export class TransactionItemComponent implements OnInit, OnDestroy {
  @Input()transaction: Transaction;
  @Input()index: number;
  showDescription = false;
  editMode = false;
  transactionForm: FormGroup;
  categories: { [s: string]: string }[];
  catSub: Subscription;

  constructor(private accountService: AccountService, private route: ActivatedRoute,
              private db: DataStorageService, private budgetService: BudgetService) { }

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
    this.categories = [];
    const categories = this.budgetService.getCategories();
    for (const id in categories) {
      if (Object.prototype.hasOwnProperty.call(categories, id)) {
        const cat = categories[id];
        this.categories.push({ name: cat.name, id: cat.id });
      }
    }
    if (!('category' in this.transaction)) {
      this.transaction.category = null;
    }
  }

  onEdit(): void {
    this.editMode = true;
    this.transactionForm = new FormGroup({
      name: new FormControl(this.transaction.name, Validators.required),
      date: new FormControl(this.transaction.date),
      description: new FormControl(this.transaction.description),
      amount: new FormControl(this.transaction.amount, [Validators.required, Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?))$/),
                                 Validators.min(0.01)]),
      type: new FormControl(this.transaction.type, Validators.required),
      category: new FormControl(this.transaction.category)
    });
  }

  onDelete(): void {
    this.accountService.deleteTransaction(this.route.snapshot.params.id, this.transaction.id, this.transaction.date);
    console.log(this.budgetService.getCategories());
    if (this.transaction.category) {
      this.budgetService.deleteTransaction(this.transaction);
      this.db.updateCategoryTransactions(this.transaction);
    }
    this.db.updateTransactions(this.route.snapshot.params.id);
  }

  onSubmit(): void {
    console.log(this.transaction);
    console.log(this.transactionForm.value);
    this.editMode = false;
    this.transactionForm.value.amount = Number(this.transactionForm.value.amount);
    const accID = this.route.snapshot.params.id;
    this.accountService.updateTransaction(accID, this.transactionForm.value, this.transaction.id, this.transaction.date);
    // If something has changed with the category, update accordingly
    if (this.transactionForm.value.category !== this.transaction.category) {
      // If we switched into a new category, update accordingly
      if (this.transactionForm.value.category) {
        // Check if the previous selection was a category, otherwise we don't need to delete
        if (this.transaction.category) {
          this.budgetService.deleteTransaction(this.transaction);
          this.db.updateCategoryTransactions(this.transaction);
        }
        this.budgetService.addTransaction({... this.transactionForm.value, id: this.transaction.id});
        this.db.updateCategoryTransactions({... this.transactionForm.value, id: this.transaction.id});
      }
      else {
        // The user may choose to remove the transaction from a category
        // The transaction should then be removed from the old category
        this.budgetService.deleteTransaction(this.transaction);
        this.db.updateCategoryTransactions(this.transaction);
      }
    }
    this.db.updateTransactions(accID);
  }

  onCancel(): void {
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.catSub.unsubscribe();
  }
}
