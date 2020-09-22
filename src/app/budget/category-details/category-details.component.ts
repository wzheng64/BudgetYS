import { Category } from './../../shared/category.model';
import { BudgetService } from 'src/app/shared/budget.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {
  categoryid: string;
  category: Category;

  constructor(private route: ActivatedRoute, private budgetService: BudgetService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.categoryid = params.id;
      this.category = this.budgetService.getCategory(params.id);
    });
  }

  onBack(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
