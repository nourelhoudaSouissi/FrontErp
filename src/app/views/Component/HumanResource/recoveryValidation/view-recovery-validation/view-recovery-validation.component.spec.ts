import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecoveryValidationComponent } from './view-recovery-validation.component';

describe('ViewRecoveryValidationComponent', () => {
  let component: ViewRecoveryValidationComponent;
  let fixture: ComponentFixture<ViewRecoveryValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRecoveryValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRecoveryValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
