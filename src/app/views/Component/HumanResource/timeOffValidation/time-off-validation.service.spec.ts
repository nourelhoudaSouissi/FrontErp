import { TestBed } from '@angular/core/testing';

import { TimeOffValidationService } from './time-off-validation.service';

describe('TimeOffValidationService', () => {
  let service: TimeOffValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeOffValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
