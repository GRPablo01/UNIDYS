import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Attents } from './attents';

describe('Attents', () => {
  let component: Attents;
  let fixture: ComponentFixture<Attents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Attents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Attents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
