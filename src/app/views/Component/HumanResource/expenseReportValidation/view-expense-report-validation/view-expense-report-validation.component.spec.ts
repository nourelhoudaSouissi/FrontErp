import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpenseReportValidationComponent } from './view-expense-report-validation.component';

describe('ViewExpenseReportValidationComponent', () => {
  let component: ViewExpenseReportValidationComponent;
  let fixture: ComponentFixture<ViewExpenseReportValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpenseReportValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewExpenseReportValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
