import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgessionE } from './progession-e';

describe('ProgessionE', () => {
  let component: ProgessionE;
  let fixture: ComponentFixture<ProgessionE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgessionE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgessionE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
