import { TestBed } from '@angular/core/testing';

import { ProfileCatalogService } from './profile-catalog.service';

describe('ProfileCatalogService', () => {
  let service: ProfileCatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileCatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
