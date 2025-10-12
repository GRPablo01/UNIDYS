import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilA } from './accueil-a';

describe('AccueilA', () => {
  let component: AccueilA;
  let fixture: ComponentFixture<AccueilA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
