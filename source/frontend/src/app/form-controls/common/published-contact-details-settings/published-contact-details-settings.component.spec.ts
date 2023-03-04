import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedContactDetailsSettingsComponent } from './published-contact-details-settings.component';

describe('PublishedContactDetailsComponent', () => {
  let component: PublishedContactDetailsSettingsComponent;
  let fixture: ComponentFixture<PublishedContactDetailsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishedContactDetailsSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishedContactDetailsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
