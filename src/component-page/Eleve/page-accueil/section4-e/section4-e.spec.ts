import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section4E } from './section4-e';

describe('Section4E', () => {
  let component: Section4E;
  let fixture: ComponentFixture<Section4E>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section4E]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section4E);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
