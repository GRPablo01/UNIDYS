import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuprimerE } from './suprimer-e';

describe('SuprimerE', () => {
  let component: SuprimerE;
  let fixture: ComponentFixture<SuprimerE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuprimerE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuprimerE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
