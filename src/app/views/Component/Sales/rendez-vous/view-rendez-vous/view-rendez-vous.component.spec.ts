import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRendezVousComponent } from './view-rendez-vous.component';

describe('ViewRendezVousComponent', () => {
  let component: ViewRendezVousComponent;
  let fixture: ComponentFixture<ViewRendezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRendezVousComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
