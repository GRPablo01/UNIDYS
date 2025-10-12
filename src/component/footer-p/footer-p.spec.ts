import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterP } from './footer-p';

describe('FooterP', () => {
  let component: FooterP;
  let fixture: ComponentFixture<FooterP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
