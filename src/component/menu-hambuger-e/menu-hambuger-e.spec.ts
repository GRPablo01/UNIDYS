import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHambugerE } from './menu-hambuger-e';

describe('MenuHambugerE', () => {
  let component: MenuHambugerE;
  let fixture: ComponentFixture<MenuHambugerE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHambugerE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHambugerE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
