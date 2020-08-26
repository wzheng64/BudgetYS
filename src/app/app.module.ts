import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

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
import { BudgetingComponent } from './budgeting/budgeting.component';
import { AccountEditComponent } from './main/account-edit/account-edit.component';
import { TransactionNewComponent } from './main/account-details/transaction-new/transaction-new.component';
import { TransactionListComponent } from './main/account-details/transaction-list/transaction-list.component';
import { TransactionItemComponent } from './main/account-details/transaction-list/transaction-item/transaction-item.component';

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
    BudgetingComponent,
    AccountEditComponent,
    TransactionNewComponent,
    TransactionListComponent,
    TransactionItemComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
