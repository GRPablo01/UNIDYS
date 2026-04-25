import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuPhrase1 } from './jeu-phrase1';

describe('JeuPhrase1', () => {
  let component: JeuPhrase1;
  let fixture: ComponentFixture<JeuPhrase1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeuPhrase1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuPhrase1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
