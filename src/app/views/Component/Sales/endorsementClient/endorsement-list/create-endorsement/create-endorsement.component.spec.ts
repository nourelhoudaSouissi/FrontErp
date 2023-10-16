import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEndorsementComponent } from './create-endorsement.component';

describe('CreateEndorsementComponent', () => {
  let component: CreateEndorsementComponent;
  let fixture: ComponentFixture<CreateEndorsementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEndorsementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEndorsementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
