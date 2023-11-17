import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPhaseComponent } from './view-phase.component';

describe('ViewPhaseComponent', () => {
  let component: ViewPhaseComponent;
  let fixture: ComponentFixture<ViewPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPhaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
