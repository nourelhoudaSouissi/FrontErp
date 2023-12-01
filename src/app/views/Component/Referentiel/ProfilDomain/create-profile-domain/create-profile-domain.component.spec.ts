import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfileDomainComponent } from './create-profile-domain.component';

describe('CreateProfileDomainComponent', () => {
  let component: CreateProfileDomainComponent;
  let fixture: ComponentFixture<CreateProfileDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProfileDomainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProfileDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
