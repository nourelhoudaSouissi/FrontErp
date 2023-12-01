import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileDomainComponent } from './view-profile-domain.component';

describe('ViewProfileDomainComponent', () => {
  let component: ViewProfileDomainComponent;
  let fixture: ComponentFixture<ViewProfileDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProfileDomainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProfileDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
