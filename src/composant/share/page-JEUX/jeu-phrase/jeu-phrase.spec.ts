import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuPhrase } from './jeu-phrase';

describe('JeuPhrase', () => {
  let component: JeuPhrase;
  let fixture: ComponentFixture<JeuPhrase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeuPhrase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuPhrase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
