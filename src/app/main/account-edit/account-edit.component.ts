import { IdService } from './../../shared/id.service';
import { DataStorageService } from './../../shared/data-storage.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountType } from '../../shared/enums';
import { AccountService } from 'src/app/shared/account.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {
  id: string;
  accountForm: FormGroup;
  editMode = false;
  isMain = false;

  constructor(private db: DataStorageService, private accountService: AccountService,
              private router: Router, private route: ActivatedRoute, private idService: IdService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.editMode = params.id != null;
    });
    this.initForm();
  }

  onSubmit(): void {
    this.accountForm.value.balance = Number(this.accountForm.value.balance);
    if (this.editMode) {
      this.accountService.modifyAccount(this.accountForm.value, this.id);
      this.db.storeAccounts();
      this.router.navigate(['../'], {relativeTo: this.route});
    }
    else {
      this.accountService.addAccount(this.accountForm.value);
      this.db.storeAccounts();
      this.router.navigate(['/main']);
    }
    if (this.accountService.getMain() && this.accountService.getMain().id === this.id) {
      if (!this.isMain) {
        this.accountService.setMain('');
        this.db.updateMain('');
      }
    }
    if (this.isMain) {
      this.accountService.setMain(this.id);
      this.db.updateMain(this.id);
    }
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

  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm(): void {
    if (this.editMode) {
      const acc = this.accountService.getAccountById(this.id);
      this.accountForm = new FormGroup({
        name: new FormControl(acc.name, Validators.required),
        type: new FormControl(acc.type, Validators.required),
        transactions: new FormControl(acc.transactions),
        balance: new FormControl(acc.balance, [Validators.required,
          Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?)|0|0.00)$/), Validators.min(0)]),
        id: new FormControl(this.id)
      });
    }
    else {
      this.id = this.idService.generateAcc();
      this.accountForm = new FormGroup({
        name: new FormControl(null, Validators.required),
        type: new FormControl('CC', Validators.required),
        transactions: new FormControl([]),
        balance: new FormControl(0, [Validators.required,
          Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?)|0|0.00)$/), Validators.min(0)]),
          id: new FormControl(this.id)
      });
    }
    if (this.accountService.getMain() && this.accountService.getMain().id === this.id) {
      this.isMain = true;
    }
  }
}
