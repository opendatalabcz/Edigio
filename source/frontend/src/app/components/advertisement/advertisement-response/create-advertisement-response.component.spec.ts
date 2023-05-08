import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdvertisementResponseComponent } from './create-advertisement-response.component';

describe('AdvertisementResponseComponent', () => {
  let component: CreateAdvertisementResponseComponent;
  let fixture: ComponentFixture<CreateAdvertisementResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAdvertisementResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAdvertisementResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
