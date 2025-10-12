import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisE } from './avis-e';

describe('AvisE', () => {
  let component: AvisE;
  let fixture: ComponentFixture<AvisE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
