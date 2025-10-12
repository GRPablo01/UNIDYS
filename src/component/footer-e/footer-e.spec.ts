import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterE } from './footer-e';

describe('FooterE', () => {
  let component: FooterE;
  let fixture: ComponentFixture<FooterE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
