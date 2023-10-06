import { TestBed } from '@angular/core/testing';

import { RecoveryValidationService } from './recovery-validation.service';

describe('RecoveryValidationService', () => {
  let service: RecoveryValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecoveryValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
