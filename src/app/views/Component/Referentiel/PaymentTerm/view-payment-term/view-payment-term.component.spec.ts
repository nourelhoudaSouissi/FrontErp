import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaymentTermComponent } from './view-payment-term.component';

describe('ViewPaymentTermComponent', () => {
  let component: ViewPaymentTermComponent;
  let fixture: ComponentFixture<ViewPaymentTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPaymentTermComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPaymentTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
