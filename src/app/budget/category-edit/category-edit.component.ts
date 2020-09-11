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
              private budgetService: BudgetService, private db: DataStorageService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.editMode = params.id != null;
    });
    this.initForm();
  }

  onSubmit(): void {
    console.log(this.categoryForm.value);
    this.budgetService.addCategory(this.categoryForm.value);
    this.db.storeCategories();
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm(): void {
    if (this.editMode) {
      console.log('Editing current data!');
    }
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
