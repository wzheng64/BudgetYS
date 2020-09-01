import { IdService } from './id.service';
import { Transaction } from './transaction.model';
import { Account } from './account.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccountService {

  constructor(private idService: IdService, private accountService: AccountService){}

}
