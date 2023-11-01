import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceClientListComponent } from './invoice-client-list.component';

describe('InvoiceClientListComponent', () => {
  let component: InvoiceClientListComponent;
  let fixture: ComponentFixture<InvoiceClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceClientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
