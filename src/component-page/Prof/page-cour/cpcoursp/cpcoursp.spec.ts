import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPCOURSP } from './cpcoursp';

describe('CPCOURSE', () => {
  let component: CPCOURSP;
  let fixture: ComponentFixture<CPCOURSP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPCOURSP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPCOURSP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
