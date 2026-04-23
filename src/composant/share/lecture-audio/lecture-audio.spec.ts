import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureAudio } from './lecture-audio';

describe('LectureAudio', () => {
  let component: LectureAudio;
  let fixture: ComponentFixture<LectureAudio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureAudio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureAudio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
