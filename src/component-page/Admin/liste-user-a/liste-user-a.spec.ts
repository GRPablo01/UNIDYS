import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeUserA } from './liste-user-a';

describe('ListeUserA', () => {
  let component: ListeUserA;
  let fixture: ComponentFixture<ListeUserA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeUserA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeUserA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
