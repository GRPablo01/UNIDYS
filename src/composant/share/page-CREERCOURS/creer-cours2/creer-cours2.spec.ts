import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerCours2 } from './creer-cours2';

describe('CreerCours2', () => {
  let component: CreerCours2;
  let fixture: ComponentFixture<CreerCours2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerCours2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerCours2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
