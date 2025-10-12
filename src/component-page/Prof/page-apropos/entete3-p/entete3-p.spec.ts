import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entete3E } from './entete3-e';

describe('Entete3E', () => {
  let component: Entete3E;
  let fixture: ComponentFixture<Entete3E>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entete3E]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entete3E);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
