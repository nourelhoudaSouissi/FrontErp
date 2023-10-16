import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationPopComponent } from './quotation-pop.component';

describe('QuotationPopComponent', () => {
  let component: QuotationPopComponent;
  let fixture: ComponentFixture<QuotationPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationPopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
