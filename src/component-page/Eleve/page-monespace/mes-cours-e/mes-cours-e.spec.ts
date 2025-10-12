import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesCoursE } from './mes-cours-e';

describe('MesCoursE', () => {
  let component: MesCoursE;
  let fixture: ComponentFixture<MesCoursE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesCoursE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesCoursE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
