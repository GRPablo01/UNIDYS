import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderP } from './header-p';

describe('HeaderP', () => {
  let component: HeaderP;
  let fixture: ComponentFixture<HeaderP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
