import { TestBed } from '@angular/core/testing';

import { RapprochementService } from './rapprochement.service';

describe('RapprochementService', () => {
  let service: RapprochementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RapprochementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
