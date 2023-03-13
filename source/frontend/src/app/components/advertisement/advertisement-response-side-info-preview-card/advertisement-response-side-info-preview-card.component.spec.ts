import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementResponseSideInfoPreviewCardComponent } from './advertisement-response-side-info-preview-card.component';

describe('AdvertisementResponseSideInfoPreviewCardComponent', () => {
  let component: AdvertisementResponseSideInfoPreviewCardComponent;
  let fixture: ComponentFixture<AdvertisementResponseSideInfoPreviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementResponseSideInfoPreviewCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementResponseSideInfoPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
