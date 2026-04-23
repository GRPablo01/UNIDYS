import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerCours } from './creer-cours';

describe('CreerCours', () => {
  let component: CreerCours;
  let fixture: ComponentFixture<CreerCours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerCours]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerCours);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
