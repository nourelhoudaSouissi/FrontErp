import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTvaCodeComponent } from './create-tva-code.component';

describe('CreateTvaCodeComponent', () => {
  let component: CreateTvaCodeComponent;
  let fixture: ComponentFixture<CreateTvaCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTvaCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTvaCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
