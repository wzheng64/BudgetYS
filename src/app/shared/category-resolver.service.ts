import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStorageService } from './data-storage.service';
import { Category } from './category.model';
import { BudgetService } from './budget.service';

@Injectable({ providedIn: 'root' })
export class CategoryResolverService implements Resolve<{ [s: string]: Category; }>{
  constructor(private data: DataStorageService, private budgetService: BudgetService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): { [s: string]: Category; } |
   Observable<{ [s: string]: Category; }> | Promise<{ [s: string]: Category; }> {
    const cats = this.budgetService.getCategories();

    if (Object.keys(cats).length === 0) {
      return this.data.getCategories();
    }
    else {
      return cats;
    }
  }
}
