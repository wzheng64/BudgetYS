import { DataStorageService } from './../../../shared/data-storage.service';
import { AccountService } from 'src/app/shared/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-transaction-new',
  templateUrl: './transaction-new.component.html',
  styleUrls: ['./transaction-new.component.css']
})
export class TransactionNewComponent implements OnInit {
  transactionForm: FormGroup;

  constructor(private accountService: AccountService, private router: Router,
              private route: ActivatedRoute, private db: DataStorageService) { }

  ngOnInit(): void {
    this.transactionForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      date: new FormControl(new Date().toLocaleDateString('en-CA')),
      description: new FormControl(null),
      amount: new FormControl(0, [Validators.required, Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?))$/),
                                 Validators.min(0.01)]),
      type: new FormControl('-', Validators.required)
    });
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
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
