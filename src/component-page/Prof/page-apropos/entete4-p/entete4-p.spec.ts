import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entete4E } from './entete4-e';

describe('Entete4E', () => {
  let component: Entete4E;
  let fixture: ComponentFixture<Entete4E>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entete4E]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entete4E);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
