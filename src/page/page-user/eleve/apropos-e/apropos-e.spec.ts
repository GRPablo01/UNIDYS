import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AproposE } from './apropos-e';

describe('AproposE', () => {
  let component: AproposE;
  let fixture: ComponentFixture<AproposE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AproposE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AproposE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
