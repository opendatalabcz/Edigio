import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEmailEditConfirmationDialogComponent } from './user-email-edit-confirmation-dialog.component';

describe('UserEmailEditConfirmationDialogComponent', () => {
  let component: UserEmailEditConfirmationDialogComponent;
  let fixture: ComponentFixture<UserEmailEditConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEmailEditConfirmationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEmailEditConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
