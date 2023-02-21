import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdvertisementInfoFormComponent } from './create-advertisement-info-form.component';

describe('CreateAdvertisementInfoFormComponentTsComponent', () => {
  let component: CreateAdvertisementInfoFormComponent;
  let fixture: ComponentFixture<CreateAdvertisementInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAdvertisementInfoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAdvertisementInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
