import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuQCM1 } from './jeu-qcm1';

describe('JeuQCM1', () => {
  let component: JeuQCM1;
  let fixture: ComponentFixture<JeuQCM1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeuQCM1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuQCM1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
