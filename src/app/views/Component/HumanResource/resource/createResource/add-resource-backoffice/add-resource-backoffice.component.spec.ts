import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceBackofficeComponent } from './add-resource-backoffice.component';

describe('AddResourceBackofficeComponent', () => {
  let component: AddResourceBackofficeComponent;
  let fixture: ComponentFixture<AddResourceBackofficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddResourceBackofficeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddResourceBackofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
