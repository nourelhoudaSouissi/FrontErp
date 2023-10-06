import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CandidatDetailComponent } from './candidat-details.component';

describe('CandidatDetailComponent', () => {
  let component: CandidatDetailComponent;
  let fixture: ComponentFixture<CandidatDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
