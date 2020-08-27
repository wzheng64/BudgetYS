import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageService } from './../../../../shared/data-storage.service';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/shared/account.service';
import { Transaction } from './../../../../shared/transaction.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.css']
})
export class TransactionItemComponent implements OnInit {
  @Input()transaction: Transaction;
  @Input()index: number;
  showDescription = false;
  editMode = false;
  transactionForm: FormGroup;

  constructor(private accountService: AccountService, private route: ActivatedRoute, private db: DataStorageService) { }

  ngOnInit(): void {
  }

  onEdit(): void {
    this.editMode = true;
    this.transactionForm = new FormGroup({
      name: new FormControl(this.transaction.name, Validators.required),
      date: new FormControl(this.transaction.date),
      description: new FormControl(this.transaction.description),
      amount: new FormControl(this.transaction.amount, [Validators.required, Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?))$/),
                                 Validators.min(0.01)]),
      type: new FormControl(this.transaction.type, Validators.required)
    });
  }

  onDelete(): void {
    this.accountService.deleteTransaction(+this.route.snapshot.params.id, this.index);
    this.db.updateTransactions(+this.route.snapshot.params.id);
  }

  onSubmit(): void {
    this.editMode = false;
    this.transactionForm.value.amount = Number(this.transactionForm.value.amount);
    const accID = +this.route.snapshot.params.id;
    this.accountService.updateTransaction(accID, this.transactionForm.value, this.index);
    this.db.updateTransactions(accID);
  }

  onCancel(): void {
    this.editMode = false;
  }
}
