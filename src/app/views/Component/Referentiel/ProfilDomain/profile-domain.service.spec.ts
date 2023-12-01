import { TestBed } from '@angular/core/testing';

import { ProfileDomainService } from './profile-domain.service';

describe('ProfileDomainService', () => {
  let service: ProfileDomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileDomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
