import { TestBed } from '@angular/core/testing';

import { TvaCodeService } from './tva-code.service';

describe('TvaCodeService', () => {
  let service: TvaCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TvaCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
