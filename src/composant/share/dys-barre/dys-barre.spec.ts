import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DysBarre } from './dys-barre';

describe('DysBarre', () => {
  let component: DysBarre;
  let fixture: ComponentFixture<DysBarre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DysBarre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DysBarre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
