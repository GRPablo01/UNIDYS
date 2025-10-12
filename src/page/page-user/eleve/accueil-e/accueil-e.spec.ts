import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilE } from './accueil-e';

describe('AccueilE', () => {
  let component: AccueilE;
  let fixture: ComponentFixture<AccueilE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
