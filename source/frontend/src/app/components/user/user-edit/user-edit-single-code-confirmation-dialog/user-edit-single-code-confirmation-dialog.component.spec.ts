import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditSingleCodeConfirmationDialogComponent } from './user-edit-single-code-confirmation-dialog.component';

describe('UserEditSingleCodeConfirmationDialogComponent', () => {
  let component: UserEditSingleCodeConfirmationDialogComponent;
  let fixture: ComponentFixture<UserEditSingleCodeConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEditSingleCodeConfirmationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEditSingleCodeConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
