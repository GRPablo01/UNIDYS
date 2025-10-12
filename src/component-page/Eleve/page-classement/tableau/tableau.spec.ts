import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tableau } from './tableau';

describe('Tableau', () => {
  let component: Tableau;
  let fixture: ComponentFixture<Tableau>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tableau]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tableau);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
