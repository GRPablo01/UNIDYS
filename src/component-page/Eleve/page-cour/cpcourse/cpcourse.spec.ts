import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPCOURSE } from './cpcourse';

describe('CPCOURSE', () => {
  let component: CPCOURSE;
  let fixture: ComponentFixture<CPCOURSE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPCOURSE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPCOURSE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
