import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassementG } from './classement-g';

describe('ClassementG', () => {
  let component: ClassementG;
  let fixture: ComponentFixture<ClassementG>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassementG]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassementG);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
