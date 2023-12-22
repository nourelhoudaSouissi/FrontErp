import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCalculationUnitComponent } from './list-calculation-unit.component';

describe('ListCalculationUnitComponent', () => {
  let component: ListCalculationUnitComponent;
  let fixture: ComponentFixture<ListCalculationUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCalculationUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCalculationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
