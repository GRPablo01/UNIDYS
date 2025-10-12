import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourcesE } from './ressources-e';

describe('RessourcesE', () => {
  let component: RessourcesE;
  let fixture: ComponentFixture<RessourcesE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RessourcesE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RessourcesE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
