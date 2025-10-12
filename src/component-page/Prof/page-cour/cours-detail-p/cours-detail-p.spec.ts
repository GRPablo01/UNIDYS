import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursdetailP } from './cours-detail-p';

describe('CoursDetailP', () => {
  let component: CoursdetailP;
  let fixture: ComponentFixture<CoursdetailP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursdetailP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursdetailP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
