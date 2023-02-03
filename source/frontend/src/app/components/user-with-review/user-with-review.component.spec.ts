import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWithReviewComponent } from './user-with-review.component';

describe('UserWithReviewComponent', () => {
  let component: UserWithReviewComponent;
  let fixture: ComponentFixture<UserWithReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWithReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWithReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
