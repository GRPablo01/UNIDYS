import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerJeux2 } from './creer-jeux2';

describe('CreerJeux2', () => {
  let component: CreerJeux2;
  let fixture: ComponentFixture<CreerJeux2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerJeux2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerJeux2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
