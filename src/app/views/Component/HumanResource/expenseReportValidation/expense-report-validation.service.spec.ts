import { TestBed } from '@angular/core/testing';

import { ExpenseReportValidationService } from './expense-report-validation.service';

describe('ExpenseReportValidationService', () => {
  let service: ExpenseReportValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseReportValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
