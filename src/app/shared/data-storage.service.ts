import { Transaction } from './transaction.model';
import { Category } from './category.model';
import { BudgetService } from './budget.service';
import { Income } from './income.model';
import { IdService } from './id.service';
import { AuthService } from './../auth/auth.service';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { AccountService } from './account.service';
import { Account } from './account.model';
import { HelperService } from './helper.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private accountService: AccountService,
              private authService: AuthService, private idService: IdService,
              private budgetService: BudgetService, private help: HelperService) {

  }

  /*
    Below are all the database storage methods for accounts and their transactions
  */

  /* Below are methods that handle accounts */

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
                const transactions = acc.transactions ? acc.transactions : {};
                accounts[id] = new Account(acc.name, acc.type, transactions, acc.balance, id);
              }
            }
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

  deleteAccount(accountid: string): void {
    this.http.delete(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/accounts/${accountid}.json`)
    .subscribe();
  }

  /* Methods based on the transactions of accounts */

  updateTransactions(accID: string): void {
    const acc = this.accountService.getAccountById(accID);
    this.http.put(`https://budgetys-9ff7a.firebaseio.com/users/${ this.authService.user.value.id }/accounts/${accID}.json`, acc)
      .subscribe(response => {
      console.log(response);
    });
  }

  /* Below are methods that handle the main account selection */

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

  /*
    Below are methods based on the income
  */

  updateIncome(income: Income): void {
    this.http.patch<Income>(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/income.json`, income)
      .subscribe(response => {
        console.log(response);
      });
  }

  getIncome(): Observable<Income> {
    return this.http.get<Income>(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/income.json`)
      .pipe(
        take(1),
        map(income => {
          if (income) {
            const accounts = income.accounts ? income.accounts : [];
            const fixedIncome = new Income(income.income, income.period, accounts, income.remainder, income.lastPayDate);
            return fixedIncome;
          }
          else {
            return {};
          }
        }),
        tap((inc: Income) => {
          this.budgetService.setIncome(inc);
          if (localStorage.getItem('currentPeriod')) {
            this.budgetService.setCurrentPeriod(localStorage.getItem('currentPeriod'));
          }
          else {
            this.budgetService.setCurrentPeriod(inc.period);
          }
        })
      );
  }

  /*
    Below are methods that handle the income and their transactions
  */

  /* Below are methods that handle categories */

  storeCategories(): void {
    const categories = this.budgetService.getCategories();
    this.http.patch<{[s: string]: Category}>(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/categories.json`
    , categories)
      .subscribe(res => console.log(res));
  }

  getCategories(): Observable<{[s: string]: Category}> {
    return this.http.get<{[s: string]: Category}>(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/categories.json`)
      .pipe(
        map((categories: {[s: string]: Category}) => {
          if (categories) {
            for (const id in categories) {
              if (Object.prototype.hasOwnProperty.call(categories, id)) {
                const cat = categories[id];
                const transactions = cat.transactions ? cat.transactions : {};
                const subCat = cat.subCategories ? cat.subCategories : {};
                const historyCat = cat.budgetHistories ? cat.budgetHistories : {};
                categories[id] = new Category(cat.name, transactions, cat.amount, id, cat.period, subCat, historyCat);
              }
            }
            return categories;
          }
          else {
            return {};
          }
        }),
        tap(categories => {
          this.budgetService.setCategories(categories);
          this.idService.setCatIds(categories);
        })
      );
  }

  updateCategory(categoryid: string, properties?: string[]): void {
    const category = this.budgetService.getCategory(categoryid);
    if (properties) {
      properties.forEach((property: string) => {
        if (category[property]) {
          this.http.put(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/categories/${categoryid}/${property}.json`, category[property])
          .subscribe(res => console.log(res));
        }
      });
    }
    else {
      this.http.put<Category>(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/categories/${categoryid}.json`,
      category)
      .subscribe(res => console.log(res));
    }
  }

  deleteCategory(categoryid: string): void {
    this.http.delete(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/categories/${categoryid}.json`)
    .subscribe();
  }

  /* Below are methods that handle transactions for categories */

  addCategoryTransactions(transaction: Transaction): void {
    const week = this.help.getWeek(transaction.date);
    this.http.patch<Transaction>(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/categories/${transaction.category}/transactions/${week}/${transaction.id}.json`, transaction)
    .subscribe(res => console.log(res));
  }

  updateCategoryTransactions(transaction: Transaction): void {
    const week = this.help.getWeek(transaction.date);
    const category = this.budgetService.getCategory(transaction.category);
    this.http.put<Category>(`https://budgetys-9ff7a.firebaseio.com/users/${this.authService.user.value.id}/categories/${transaction.category}/transactions/${week}.json`, category.transactions[week])
    .subscribe(res => console.log(res));
  }
}

