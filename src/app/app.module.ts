import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SummaryComponent } from './main/summary/summary.component';
import { AccountsListComponent } from './main/accounts-list/accounts-list.component';
import { AccountDetailsComponent } from './main/account-details/account-details.component';
import { AccountComponent } from './main/accounts-list/account/account.component';
import { AccountEditComponent } from './main/account-edit/account-edit.component';
import { TransactionNewComponent } from './main/account-details/transaction-new/transaction-new.component';
import { TransactionListComponent } from './main/account-details/transaction-list/transaction-list.component';
import { TransactionItemComponent } from './main/account-details/transaction-list/transaction-item/transaction-item.component';
import { AlertComponent } from './shared/alert/alert.component';
import { IncomeDisplayComponent } from './main/income-display/income-display.component';
import { BudgetComponent } from './budget/budget.component';
import { IncomeComponent } from './budget/income/income.component';
import { IncomeEditComponent } from './budget/income/income-edit/income-edit.component';
import { CategoriesListComponent } from './budget/categories-list/categories-list.component';
import { CategoryDetailsComponent } from './budget/category-details/category-details.component';
import { CategoryEditComponent } from './budget/category-edit/category-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    SummaryComponent,
    AccountsListComponent,
    AccountDetailsComponent,
    HeaderComponent,
    AccountComponent,
    AccountEditComponent,
    TransactionNewComponent,
    TransactionListComponent,
    TransactionItemComponent,
    AlertComponent,
    IncomeDisplayComponent,
    BudgetComponent,
    IncomeComponent,
    IncomeEditComponent,
    CategoriesListComponent,
    CategoryDetailsComponent,
    CategoryEditComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
