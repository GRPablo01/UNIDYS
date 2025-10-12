import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassementE } from './classement-e';

describe('ClassementE', () => {
  let component: ClassementE;
  let fixture: ComponentFixture<ClassementE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassementE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassementE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
