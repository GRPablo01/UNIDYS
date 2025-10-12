import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CGUTexte } from './cgu-texte';

describe('CGUTexte', () => {
  let component: CGUTexte;
  let fixture: ComponentFixture<CGUTexte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CGUTexte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CGUTexte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
