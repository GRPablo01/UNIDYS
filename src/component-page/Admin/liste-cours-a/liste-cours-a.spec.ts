import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCoursA } from './liste-cours-a';

describe('ListeCoursA', () => {
  let component: ListeCoursA;
  let fixture: ComponentFixture<ListeCoursA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeCoursA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeCoursA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
