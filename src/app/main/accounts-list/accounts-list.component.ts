import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from 'src/app/shared/account.service';
import { Account } from '../../shared/account.model';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.css']
})
export class AccountsListComponent implements OnInit, OnDestroy {
  accSub: Subscription;
  accounts: { [s: string]: Account; } = {};
  accountList: Account[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private accountService: AccountService) { }

  ngOnInit(): void {
    this.accSub = this.accountService.accountsChanged.subscribe((accs: { [s: string]: Account; }) => {
      this.accounts = accs;
      this.accountList = [];
      for (const id in this.accounts) {
        if (Object.prototype.hasOwnProperty.call(this.accounts, id)) {
          this.accountList.push(this.accounts[id]);
        }
      }
      this.accountList.sort((a, b) => (a.name > b.name) ? -1 : 1);
    });
    this.accounts = this.accountService.getAccounts();
    for (const id in this.accounts) {
      if (Object.prototype.hasOwnProperty.call(this.accounts, id)) {
        this.accountList.push(this.accounts[id]);
      }
    }
    this.accountList.sort((a, b) => (a.name > b.name) ? -1 : 1);
  }

  onNewAccount(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.accSub.unsubscribe();
  }
}
