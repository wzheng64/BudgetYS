import { DataStorageService } from './../../shared/data-storage.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountType } from '../../shared/enums';
import { AccountService } from 'src/app/shared/account.service';
import { Account } from 'src/app/shared/account.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {
  accountForm: FormGroup;

  constructor(private db: DataStorageService, private accountService: AccountService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.accountForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      type: new FormControl('CC', Validators.required),
      transactions: new FormControl([]),
      balance: new FormControl(0, Validators.pattern(/^[0-9]*\.[0-9]{2}$/))
    });
  }

  onSubmit(): void {
    this.accountService.addAccount(this.accountForm.value);
    this.db.storeAccounts();
    this.router.navigate(['/main']);
  }

  public getTypes(): string[] {
    const types = [];
    for (const t in AccountType) {
      if (isNaN(Number(t))) {
        types.push(t);
      }
    }
    return types;
  }

}
