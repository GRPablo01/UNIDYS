import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprentissageE } from './apprentissage-e';

describe('ApprentissageE', () => {
  let component: ApprentissageE;
  let fixture: ComponentFixture<ApprentissageE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprentissageE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprentissageE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
