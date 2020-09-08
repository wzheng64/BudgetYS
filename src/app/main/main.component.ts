import { DataStorageService } from 'src/app/shared/data-storage.service';
import { BudgetService } from './../shared/budget.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private budgetService: BudgetService, private data: DataStorageService) { }

  ngOnInit(): void {
    if (this.budgetService.payIncome()) {
      this.data.storeAccounts();
    }
  }
}
