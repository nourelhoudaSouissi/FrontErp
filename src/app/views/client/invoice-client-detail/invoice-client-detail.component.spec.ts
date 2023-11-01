import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceClientDetailComponent } from './invoice-client-detail.component';

describe('InvoiceClientDetailComponent', () => {
  let component: InvoiceClientDetailComponent;
  let fixture: ComponentFixture<InvoiceClientDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceClientDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceClientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
