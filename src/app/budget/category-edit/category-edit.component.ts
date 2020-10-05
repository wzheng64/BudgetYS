import { HelperService } from './../../shared/helper.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { BudgetService } from './../../shared/budget.service';
import { IdService } from './../../shared/id.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {
  id: string;
  categoryForm: FormGroup;
  editMode = false;
  periods = ['Week', '2 Weeks', 'Month'];

  constructor(private route: ActivatedRoute, private router: Router, private idService: IdService,
              private budgetService: BudgetService, private db: DataStorageService, private help: HelperService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.categoryid;
      this.editMode = params.categoryid != null;
    });
    this.initForm();
  }

  onSubmit(): void {
    const incomingCategory = this.categoryForm.value;
    if (this.editMode) {
      const week = this.help.getWeek(new Date().toLocaleString('sv-SE').split(' ')[0]);
      this.budgetService.modifyCategory(incomingCategory, week);
      this.db.updateCategory(this.id);
      this.router.navigate(['../'], { relativeTo: this.route });
    }
    else {
      incomingCategory.budgetHistories = {
        [this.help.getWeek(new Date().toLocaleString('sv-SE').split(' ')[0])]: this.categoryForm.value.amount
      };
      this.budgetService.addCategory(incomingCategory);
      this.db.storeCategories();
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm(): void {
    if (this.editMode) {
      const category = this.budgetService.getCategory(this.id);
      this.categoryForm = new FormGroup({
        name: new FormControl(category.name, Validators.required),
        transactions: new FormControl(category.transactions),
        amount: new FormControl(category.amount, [Validators.required,
        Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?)|0|0.00)$/), Validators.min(0)]),
        period: new FormControl(category.period, [Validators.required]),
        id: new FormControl(this.id),
        subCategories: new FormControl({})
      });
    }
    else {
      this.id = this.idService.generateCategory();
      this.categoryForm = new FormGroup({
        name: new FormControl(null, Validators.required),
        transactions: new FormControl({}),
        amount: new FormControl(null, [Validators.required,
        Validators.pattern(/^((0\.[0-9][1-9])|([1-9][0-9]*(\.[0-9]{2})?)|0|0.00)$/), Validators.min(0)]),
        period: new FormControl('Week', [Validators.required]),
        id: new FormControl(this.id),
        subCategories: new FormControl({})
      });
    }
  }
}
