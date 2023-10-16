import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEndorsementComponent } from './view-endorsement.component';

describe('ViewEndorsementComponent', () => {
  let component: ViewEndorsementComponent;
  let fixture: ComponentFixture<ViewEndorsementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEndorsementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEndorsementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
