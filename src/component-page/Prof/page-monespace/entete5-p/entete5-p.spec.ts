import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entete5E } from './entete5-e';

describe('Entete5E', () => {
  let component: Entete5E;
  let fixture: ComponentFixture<Entete5E>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entete5E]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entete5E);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
