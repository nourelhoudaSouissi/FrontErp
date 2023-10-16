import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeContractComponent } from './liste-contract.component';

describe('ListeContractComponent', () => {
  let component: ListeContractComponent;
  let fixture: ComponentFixture<ListeContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
