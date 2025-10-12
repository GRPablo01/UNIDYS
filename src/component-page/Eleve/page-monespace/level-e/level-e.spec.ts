import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelE } from './level-e';

describe('LevelE', () => {
  let component: LevelE;
  let fixture: ComponentFixture<LevelE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
