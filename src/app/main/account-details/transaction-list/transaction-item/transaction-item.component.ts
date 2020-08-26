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

  constructor() { }

  ngOnInit(): void {
  }

}
