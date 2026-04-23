import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MMS } from './mms';

describe('MMS', () => {
  let component: MMS;
  let fixture: ComponentFixture<MMS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MMS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MMS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
