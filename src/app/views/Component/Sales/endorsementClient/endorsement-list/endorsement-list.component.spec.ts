import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementListComponent } from './endorsement-list.component';

describe('EndorsementListComponent', () => {
  let component: EndorsementListComponent;
  let fixture: ComponentFixture<EndorsementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorsementListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndorsementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
