import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTvaCodeComponent } from './list-tva-code.component';

describe('ListTvaCodeComponent', () => {
  let component: ListTvaCodeComponent;
  let fixture: ComponentFixture<ListTvaCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTvaCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTvaCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
