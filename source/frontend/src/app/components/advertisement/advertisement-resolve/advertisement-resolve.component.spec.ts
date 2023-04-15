import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementResolveComponent } from './advertisement-resolve.component';

describe('AdvertisementResolveComponent', () => {
  let component: AdvertisementResolveComponent;
  let fixture: ComponentFixture<AdvertisementResolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementResolveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementResolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
