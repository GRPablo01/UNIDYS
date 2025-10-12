import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonespaceE } from './monespace-e';

describe('MonespaceE', () => {
  let component: MonespaceE;
  let fixture: ComponentFixture<MonespaceE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonespaceE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonespaceE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
