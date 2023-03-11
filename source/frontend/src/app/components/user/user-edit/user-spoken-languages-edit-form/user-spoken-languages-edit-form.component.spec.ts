import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSpokenLanguagesEditFormComponent } from './user-spoken-languages-edit-form.component';

describe('UserSpokenLanguagesEditFormComponent', () => {
  let component: UserSpokenLanguagesEditFormComponent;
  let fixture: ComponentFixture<UserSpokenLanguagesEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSpokenLanguagesEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSpokenLanguagesEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
