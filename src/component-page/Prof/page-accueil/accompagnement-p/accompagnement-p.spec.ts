import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccompagnementE } from './accompagnement-p';

describe('AccompagnementE', () => {
  let component: AccompagnementE;
  let fixture: ComponentFixture<AccompagnementE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccompagnementE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccompagnementE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
