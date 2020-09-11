import { Subscription } from 'rxjs';
import { BudgetService } from './../../shared/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/category.model';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  catSub: Subscription;
  categoriesList: Category[];

  constructor(private route: ActivatedRoute, private router: Router, private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.catSub = this.budgetService.catChanged.subscribe((catss: {[s: string]: Category}) => {
      this.categoriesList = [];
      for (const id in catss) {
        if (Object.prototype.hasOwnProperty.call(catss, id)) {
          this.categoriesList.push(catss[id]);
        }
      }
      this.categoriesList.sort((a, b) => (a.name > b.name) ? -1 : 1);
    });
    const cats = this.budgetService.getCategories();
    this.categoriesList = [];
    for (const id in cats) {
      if (Object.prototype.hasOwnProperty.call(cats, id)) {
        this.categoriesList.push(cats[id]);
      }
    }
    this.categoriesList.sort((a, b) => (a.name > b.name) ? -1 : 1);
  }

  onNewCategory(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
