import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEmailEditFormComponent } from './user-email-edit-form.component';

describe('UserEmailEditFormComponent', () => {
  let component: UserEmailEditFormComponent;
  let fixture: ComponentFixture<UserEmailEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEmailEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEmailEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
