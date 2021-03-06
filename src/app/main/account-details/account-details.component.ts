import { DataStorageService } from './../../shared/data-storage.service';
import { Transaction } from './../../shared/transaction.model';
import { AccountService } from 'src/app/shared/account.service';
import { Account } from './../../shared/account.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  account: Account;
  index: string;
  delete = false;

  constructor(private accountService: AccountService, private db: DataStorageService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params ) => {
      this.index = params.accountid;
      this.account = this.accountService.getAccountById(this.index);
    });
  }

  onNewTransaction(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onEdit(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete(): void {
    this.delete = false;
    if (this.accountService.getMain() && this.accountService.getMain().id === this.index) {
      this.accountService.setMain('');
      this.db.updateMain('');
    }
    this.accountService.deleteAccount(this.index);
    this.router.navigate(['../'], {relativeTo: this.route});
    this.db.deleteAccount(this.index);
  }

}
