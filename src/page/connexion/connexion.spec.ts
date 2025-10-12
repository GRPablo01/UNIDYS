import { ComponentFixture, TestBed } from '@angular/core/testing';

import { connexion } from './connexion';

describe('connexion', () => {
  let component: connexion;
  let fixture: ComponentFixture<connexion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [connexion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(connexion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
