import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementResponseComponent } from './advertisement-response.component';

describe('AdvertisementResponseComponent', () => {
  let component: AdvertisementResponseComponent;
  let fixture: ComponentFixture<AdvertisementResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
