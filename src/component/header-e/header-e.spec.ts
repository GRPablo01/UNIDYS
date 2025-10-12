import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderE } from './header-e';

describe('HeaderE', () => {
  let component: HeaderE;
  let fixture: ComponentFixture<HeaderE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
