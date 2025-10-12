import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DPE } from './dpe';

describe('DPE', () => {
  let component: DPE;
  let fixture: ComponentFixture<DPE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DPE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DPE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
