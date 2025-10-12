import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CGU } from './cgu';

describe('CGU', () => {
  let component: CGU;
  let fixture: ComponentFixture<CGU>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CGU]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CGU);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
