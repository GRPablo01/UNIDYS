import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteteE } from './entete-p';

describe('EnteteE', () => {
  let component: EnteteE;
  let fixture: ComponentFixture<EnteteE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnteteE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnteteE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
