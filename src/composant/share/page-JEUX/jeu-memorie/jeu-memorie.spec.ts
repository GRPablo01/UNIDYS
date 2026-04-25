import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuMemorie } from './jeu-memorie';

describe('JeuMemorie', () => {
  let component: JeuMemorie;
  let fixture: ComponentFixture<JeuMemorie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeuMemorie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuMemorie);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
