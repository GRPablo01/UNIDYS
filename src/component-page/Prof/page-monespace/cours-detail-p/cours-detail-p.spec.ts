import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursDetailP } from './cours-detail-p';

describe('CoursDetailP', () => {
  let component: CoursDetailP;
  let fixture: ComponentFixture<CoursDetailP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursDetailP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursDetailP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
