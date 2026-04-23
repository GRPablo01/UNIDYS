import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XpBarre } from './xp-barre';

describe('XpBarre', () => {
  let component: XpBarre;
  let fixture: ComponentFixture<XpBarre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XpBarre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XpBarre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
