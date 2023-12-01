import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProfileDomainComponent } from './list-profile-domain.component';

describe('ListProfileDomainComponent', () => {
  let component: ListProfileDomainComponent;
  let fixture: ComponentFixture<ListProfileDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProfileDomainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProfileDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
