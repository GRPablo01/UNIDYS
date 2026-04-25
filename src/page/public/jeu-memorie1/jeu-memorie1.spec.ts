import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuMemorie1 } from './jeu-memorie1';

describe('JeuMemorie1', () => {
  let component: JeuMemorie1;
  let fixture: ComponentFixture<JeuMemorie1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeuMemorie1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuMemorie1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
