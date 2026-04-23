import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Histoire } from './histoire';

describe('Histoire', () => {
  let component: Histoire;
  let fixture: ComponentFixture<Histoire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Histoire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Histoire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
