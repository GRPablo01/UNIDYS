import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseCP } from './classe-cp';

describe('ClasseCP', () => {
  let component: ClasseCP;
  let fixture: ComponentFixture<ClasseCP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasseCP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasseCP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
