import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublishedContactDetailEditComponent } from './user-published-contact-detail-edit.component';

describe('UserPublishedContactDetailEditComponent', () => {
  let component: UserPublishedContactDetailEditComponent;
  let fixture: ComponentFixture<UserPublishedContactDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPublishedContactDetailEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPublishedContactDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
