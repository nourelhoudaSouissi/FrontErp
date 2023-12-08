import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentTermComponent } from './create-payment-term.component';

describe('CreatePaymentTermComponent', () => {
  let component: CreatePaymentTermComponent;
  let fixture: ComponentFixture<CreatePaymentTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaymentTermComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePaymentTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
