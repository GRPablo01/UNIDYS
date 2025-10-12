import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderA } from './header-a';

describe('HeaderA', () => {
  let component: HeaderA;
  let fixture: ComponentFixture<HeaderA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
