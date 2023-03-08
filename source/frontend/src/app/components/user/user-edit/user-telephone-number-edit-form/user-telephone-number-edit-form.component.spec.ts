import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTelephoneNumberEditFormComponent } from './user-telephone-number-edit-form.component';

describe('UserTelephoneNumberEditFormComponent', () => {
  let component: UserTelephoneNumberEditFormComponent;
  let fixture: ComponentFixture<UserTelephoneNumberEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTelephoneNumberEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTelephoneNumberEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
