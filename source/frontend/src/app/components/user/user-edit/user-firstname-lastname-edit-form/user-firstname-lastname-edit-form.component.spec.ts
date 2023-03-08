import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFirstnameLastnameEditFormComponent } from './user-firstname-lastname-edit-form.component';

describe('UserFirstnameLastnameEditFormComponent', () => {
  let component: UserFirstnameLastnameEditFormComponent;
  let fixture: ComponentFixture<UserFirstnameLastnameEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFirstnameLastnameEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFirstnameLastnameEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
