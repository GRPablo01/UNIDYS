import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHambugerA } from './menu-hambuger-a';

describe('MenuHambugerA', () => {
  let component: MenuHambugerA;
  let fixture: ComponentFixture<MenuHambugerA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHambugerA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHambugerA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
