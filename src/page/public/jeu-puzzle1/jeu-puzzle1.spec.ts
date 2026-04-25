import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuPuzzle1 } from './jeu-puzzle1';

describe('JeuPuzzle1', () => {
  let component: JeuPuzzle1;
  let fixture: ComponentFixture<JeuPuzzle1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeuPuzzle1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuPuzzle1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
