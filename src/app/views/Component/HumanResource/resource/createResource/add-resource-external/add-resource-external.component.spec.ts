import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceExternalComponent } from './add-resource-external.component';

describe('AddResourceExternalComponent', () => {
  let component: AddResourceExternalComponent;
  let fixture: ComponentFixture<AddResourceExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddResourceExternalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddResourceExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
