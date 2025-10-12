import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationE } from './information-e';

describe('InformationE', () => {
  let component: InformationE;
  let fixture: ComponentFixture<InformationE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
