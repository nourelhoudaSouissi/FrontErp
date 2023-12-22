import { TestBed } from '@angular/core/testing';

import { CalculationUnitService } from './calculation-unit.service';

describe('CalculationUnitService', () => {
  let service: CalculationUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculationUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
