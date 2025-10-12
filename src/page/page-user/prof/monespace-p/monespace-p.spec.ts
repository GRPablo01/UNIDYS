import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonespaceP } from './monespace-p';

describe('MonespaceP', () => {
  let component: MonespaceP;
  let fixture: ComponentFixture<MonespaceP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonespaceP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonespaceP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
