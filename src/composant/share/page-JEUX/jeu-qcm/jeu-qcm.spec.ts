import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuQCM } from './jeu-qcm';

describe('JeuQCM', () => {
  let component: JeuQCM;
  let fixture: ComponentFixture<JeuQCM>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeuQCM]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuQCM);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
