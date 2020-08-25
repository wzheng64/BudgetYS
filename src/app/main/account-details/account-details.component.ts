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
  index: number;

  constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params ) => {
      this.index = +params.id;
      this.account = this.accountService.getAccount(this.index);
    });
  }

}
