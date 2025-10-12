import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section5E } from './section5-e';

describe('Section5E', () => {
  let component: Section5E;
  let fixture: ComponentFixture<Section5E>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section5E]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section5E);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
