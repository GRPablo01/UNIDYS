import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MescoursP } from './mescours-p';

describe('MescoursP', () => {
  let component: MescoursP;
  let fixture: ComponentFixture<MescoursP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MescoursP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MescoursP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
