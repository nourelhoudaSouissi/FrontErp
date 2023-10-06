import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTimeOffValidationComponent } from './view-time-off-validation.component';

describe('ViewTimeOffValidationComponent', () => {
  let component: ViewTimeOffValidationComponent;
  let fixture: ComponentFixture<ViewTimeOffValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTimeOffValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTimeOffValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
