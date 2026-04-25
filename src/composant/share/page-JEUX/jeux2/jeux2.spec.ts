import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jeux2 } from './jeux2';

describe('Jeux2', () => {
  let component: Jeux2;
  let fixture: ComponentFixture<Jeux2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jeux2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jeux2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
