import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilP } from './accueil-p';

describe('AccueilP', () => {
  let component: AccueilP;
  let fixture: ComponentFixture<AccueilP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
