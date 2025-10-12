import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AproposP } from './apropos-p';

describe('AproposP', () => {
  let component: AproposP;
  let fixture: ComponentFixture<AproposP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AproposP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AproposP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
