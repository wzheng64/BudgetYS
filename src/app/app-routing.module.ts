import { BudgetingComponent } from './budgeting/budgeting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { AuthRedirectGuard } from './auth/auth-redirect.guard';

import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { AccountEditComponent } from './main/account-edit/account-edit.component';
import { AccountDetailsComponent } from './main/account-details/account-details.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full'},
  { path: 'main', component: MainComponent, canActivate: [AuthGuard], children: [
    { path: '', component: AccountDetailsComponent },
    { path: 'new', component: AccountEditComponent }
  ] },
  { path: 'budgeting', component: BudgetingComponent, canActivate: [AuthGuard]},
  { path: 'auth', component: AuthComponent, canActivate: [AuthRedirectGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
