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

  constructor(private accountService: AccountService, private route: ActivatedRoute, private db: DataStorageService) { }

  ngOnInit(): void {
  }

  onEdit(): void {
    this.editMode = true;
  }

  onDelete(): void {
    this.accountService.deleteTransaction(+this.route.snapshot.params.id, this.index);
    this.db.updateTransactions(+this.route.snapshot.params.id);
  }
}
