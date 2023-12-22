import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCalculationUnitComponent } from './view-calculation-unit.component';

describe('ViewCalculationUnitComponent', () => {
  let component: ViewCalculationUnitComponent;
  let fixture: ComponentFixture<ViewCalculationUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCalculationUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCalculationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
