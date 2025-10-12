import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementE } from './engagement-e';

describe('EngagementE', () => {
  let component: EngagementE;
  let fixture: ComponentFixture<EngagementE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngagementE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngagementE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
