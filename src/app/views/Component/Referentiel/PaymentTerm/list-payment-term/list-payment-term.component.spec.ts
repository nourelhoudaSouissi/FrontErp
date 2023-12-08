import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaymentTermComponent } from './list-payment-term.component';

describe('ListPaymentTermComponent', () => {
  let component: ListPaymentTermComponent;
  let fixture: ComponentFixture<ListPaymentTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPaymentTermComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPaymentTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
