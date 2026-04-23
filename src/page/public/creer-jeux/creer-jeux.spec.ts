import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerJeux } from './creer-jeux';

describe('CreerJeux', () => {
  let component: CreerJeux;
  let fixture: ComponentFixture<CreerJeux>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerJeux]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerJeux);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
