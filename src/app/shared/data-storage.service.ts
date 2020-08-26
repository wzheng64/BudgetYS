import { AuthService } from './../auth/auth.service';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { AccountService } from './account.service';
import { Account } from './account.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private accountService: AccountService, private authService: AuthService) {

  }

  storeAccounts(): void {
    const accounts = {accounts: this.accountService.getAccounts()};
    this.http.put(`https://budgetys-9ff7a.firebaseio.com/users/${ this.authService.user.value.id }.json`, accounts).subscribe(response => {
      console.log(response);
    });
  }

  fetchAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(
      `https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/accounts.json`
    )
      .pipe(
        map(accounts => {
          return accounts.map(acc => {
            const transactions = acc.transactions ? acc.transactions : [];
            return new Account(acc.name, acc.type, transactions, acc.balance);
          });
        }),
        tap(accounts => {
          this.accountService.setAccounts(accounts);
        })
      );
  }

  updateTransactions(accID: number): void {
    const acc = this.accountService.getAccount(accID);
    this.http.put(`https://budgetys-9ff7a.firebaseio.com/users/${ this.authService.user.value.id }/accounts/${accID}.json`, acc)
      .subscribe(response => {
      console.log(response);
    })
  }
}
