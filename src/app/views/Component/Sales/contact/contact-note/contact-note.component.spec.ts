import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactNoteComponent } from './contact-note.component';

describe('ContactNoteComponent', () => {
  let component: ContactNoteComponent;
  let fixture: ComponentFixture<ContactNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
