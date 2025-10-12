import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprentissageP } from './apprentissage-p';

describe('ApprentissageE', () => {
  let component: ApprentissageP;
  let fixture: ComponentFixture<ApprentissageP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprentissageP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprentissageP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
