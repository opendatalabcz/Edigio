import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementResponseResolvePreviewComponent } from './advertisement-response-resolve-preview.component';

describe('AdvertisementResponseResolvePreviewComponent', () => {
  let component: AdvertisementResponseResolvePreviewComponent;
  let fixture: ComponentFixture<AdvertisementResponseResolvePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementResponseResolvePreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementResponseResolvePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
