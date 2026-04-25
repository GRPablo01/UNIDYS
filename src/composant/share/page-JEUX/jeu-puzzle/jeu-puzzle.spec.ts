import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuPuzzle } from './jeu-puzzle';

describe('JeuPuzzle', () => {
  let component: JeuPuzzle;
  let fixture: ComponentFixture<JeuPuzzle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeuPuzzle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuPuzzle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
