import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCalculationUnitComponent } from './create-calculation-unit.component';

describe('CreateCalculationUnitComponent', () => {
  let component: CreateCalculationUnitComponent;
  let fixture: ComponentFixture<CreateCalculationUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCalculationUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCalculationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
