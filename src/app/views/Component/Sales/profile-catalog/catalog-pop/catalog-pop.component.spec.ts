import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPopComponent } from './catalog-pop.component';

describe('CatalogPopComponent', () => {
  let component: CatalogPopComponent;
  let fixture: ComponentFixture<CatalogPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogPopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
