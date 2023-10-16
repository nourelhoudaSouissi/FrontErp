import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractClientComponent } from './view-contract-client.component';

describe('ViewContractClientComponent', () => {
  let component: ViewContractClientComponent;
  let fixture: ComponentFixture<ViewContractClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContractClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewContractClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
