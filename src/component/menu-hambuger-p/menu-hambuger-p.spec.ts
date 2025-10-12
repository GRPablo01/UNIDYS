import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHambugerP } from './menu-hambuger-p';

describe('MenuHambugerP', () => {
  let component: MenuHambugerP;
  let fixture: ComponentFixture<MenuHambugerP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHambugerP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHambugerP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
