import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolitiqueE } from './politique-e';

describe('PolitiqueE', () => {
  let component: PolitiqueE;
  let fixture: ComponentFixture<PolitiqueE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolitiqueE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolitiqueE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
