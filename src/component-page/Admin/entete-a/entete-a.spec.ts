import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteteA } from './entete-a';

describe('EnteteA', () => {
  let component: EnteteA;
  let fixture: ComponentFixture<EnteteA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnteteA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnteteA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
