import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountType } from '../../shared/enums';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {
  accountForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.accountForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      type: new FormControl('CC', Validators.required),
      transactions: new FormControl([]),
      balance: new FormControl(0, Validators.pattern(/^[0-9]*\.[0-9]{2}$/))
    });
  }

  onSubmit(): void {
    console.log(this.accountForm);
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
