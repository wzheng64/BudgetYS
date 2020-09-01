import { IdService } from './id.service';
import { AuthService } from './../auth/auth.service';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { AccountService } from './account.service';
import { Account } from './account.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private accountService: AccountService,
              private authService: AuthService, private idService: IdService) {

  }

  storeAccounts(): void {
    const accounts = JSON.stringify(this.accountService.getAccounts());
    this.http.put(`https://budgetys-9ff7a.firebaseio.com/users/${ this.authService.user.value.id }/accounts.json`, accounts)
    .subscribe(response => {
      console.log(response);
    });
  }

  fetchAccounts(): Observable<{[s: string]: Account}> {
    return this.http.get<{[s: string]: Account}>(
      `https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/accounts.json`
    )
      .pipe(
        map(accounts => {
          if (accounts) {
            for (const id in accounts) {
              if (Object.prototype.hasOwnProperty.call(accounts, id)) {
                const acc = accounts[id];
                const transactions = acc.transactions ? acc.transactions : [];
                accounts[id] = new Account(acc.name, acc.type, transactions, acc.balance, id);
              }
            }
            console.log(accounts);
            return accounts;
          }
          else {
            return {};
          }
        }),
        tap(accounts => {
          this.accountService.setAccounts(accounts);
          this.idService.setKnownIds(accounts);
        })
      );
  }

  updateTransactions(accID: string): void {
    const acc = this.accountService.getAccountById(accID);
    this.http.put(`https://budgetys-9ff7a.firebaseio.com/users/${ this.authService.user.value.id }/accounts/${accID}.json`, acc)
      .subscribe(response => {
      console.log(response);
    });
  }

  updateMain(accID: string): void {
    const main = {main: accID};
    this.http.patch(`https://budgetys-9ff7a.firebaseio.com/users/${ this.authService.user.value.id }.json`, main)
      .subscribe(response => {
        console.log(response);
      });
  }

  getMain(): void {
    this.http.get<string>(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/main.json`)
      .pipe(
        take(1),
        tap((s) => {
          this.accountService.setMain(s);
    })).subscribe();
  }
}
