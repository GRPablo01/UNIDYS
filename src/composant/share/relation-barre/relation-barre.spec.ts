import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationBarre } from './relation-barre';

describe('RelationBarre', () => {
  let component: RelationBarre;
  let fixture: ComponentFixture<RelationBarre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelationBarre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelationBarre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
