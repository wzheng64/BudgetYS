import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDisplayComponent } from './income-display.component';

describe('IncomeDisplayComponent', () => {
  let component: IncomeDisplayComponent;
  let fixture: ComponentFixture<IncomeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
