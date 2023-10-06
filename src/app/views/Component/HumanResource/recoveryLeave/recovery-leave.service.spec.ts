import { TestBed } from '@angular/core/testing';

import { RecoveryLeaveService } from './recovery-leave.service';

describe('RecoveryLeaveService', () => {
  let service: RecoveryLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecoveryLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
