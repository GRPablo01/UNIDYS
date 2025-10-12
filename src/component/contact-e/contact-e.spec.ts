import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactE } from './contact-e';

describe('ContactE', () => {
  let component: ContactE;
  let fixture: ComponentFixture<ContactE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
