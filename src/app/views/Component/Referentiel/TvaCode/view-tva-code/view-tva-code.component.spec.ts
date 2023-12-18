import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTvaCodeComponent } from './view-tva-code.component';

describe('ViewTvaCodeComponent', () => {
  let component: ViewTvaCodeComponent;
  let fixture: ComponentFixture<ViewTvaCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTvaCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTvaCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
