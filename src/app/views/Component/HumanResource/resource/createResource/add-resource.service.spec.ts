import { TestBed } from '@angular/core/testing';

import { AddResourceService } from './add-resource.service';

describe('AddResourceService', () => {
  let service: AddResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
