import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementPreviewComponent } from './advertisement-preview.component';

describe('AdvertisementPreviewComponent', () => {
  let component: AdvertisementPreviewComponent;
  let fixture: ComponentFixture<AdvertisementPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
