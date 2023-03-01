import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdvertisementContactFormComponent } from './create-advertisement-contact-form.component';

describe('CreateAdvertisementContactFormComponent', () => {
  let component: CreateAdvertisementContactFormComponent;
  let fixture: ComponentFixture<CreateAdvertisementContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAdvertisementContactFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAdvertisementContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
