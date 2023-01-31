import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementDetailComponent } from './advertisement-detail.component';

describe('AdvertisementDetailComponent', () => {
  let component: AdvertisementDetailComponent;
  let fixture: ComponentFixture<AdvertisementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
