import { CategoryResolverService } from './shared/category-resolver.service';
import { CategoryEditComponent } from './budget/category-edit/category-edit.component';
import { CategoryDetailsComponent } from './budget/category-details/category-details.component';
import { IncomeResolverService } from './shared/income-resolver.service';
import { AccountResolverService } from './shared/account-resolver.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { AuthRedirectGuard } from './auth/auth-redirect.guard';

import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { AccountEditComponent } from './main/account-edit/account-edit.component';
import { AccountDetailsComponent } from './main/account-details/account-details.component';
import { TransactionNewComponent } from './main/account-details/transaction-new/transaction-new.component';
import { BudgetComponent } from './budget/budget.component';
import { IncomeEditComponent } from './budget/income/income-edit/income-edit.component';
import { CategorySummaryComponent } from './budget/category-summary/category-summary.component';

const routingConfig: ExtraOptions = {
  paramsInheritanceStrategy: 'always'
};

const appRoutes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  {
    path: 'main', component: MainComponent, canActivate: [AuthGuard], resolve: [AccountResolverService, IncomeResolverService], children: [
      { path: '', component: AccountDetailsComponent },
      { path: 'new', component: AccountEditComponent },
      {
        path: ':accountid', component: AccountDetailsComponent, resolve: [CategoryResolverService], children: [
          { path: 'new', component: TransactionNewComponent },
          { path: 'edit', component: AccountEditComponent }
        ]
      }
    ]
  },
  { path: 'budgeting', component: BudgetComponent, canActivate: [AuthGuard],
    resolve: [AccountResolverService, IncomeResolverService, CategoryResolverService], children: [
      { path: '', component: CategorySummaryComponent },
      { path: 'new', component: CategoryEditComponent },
      { path: 'income', component: IncomeEditComponent },
      { path: ':categoryid', component: CategoryDetailsComponent, children: [
        { path: 'edit', component: CategoryEditComponent }
      ]}
    ]
  },
  { path: 'auth', component: AuthComponent, canActivate: [AuthRedirectGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, routingConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
