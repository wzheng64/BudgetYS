import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetingComponent } from './budgeting.component';

describe('BudgetingComponent', () => {
  let component: BudgetingComponent;
  let fixture: ComponentFixture<BudgetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
