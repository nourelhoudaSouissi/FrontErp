import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractClientComponent } from './add-contract-client.component';

describe('AddContractClientComponent', () => {
  let component: AddContractClientComponent;
  let fixture: ComponentFixture<AddContractClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContractClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContractClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
