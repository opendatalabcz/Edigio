import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisedItemInfoDialogComponent } from './advertised-item-info-dialog.component';

describe('ListedItemInfoDialogComponent', () => {
  let component: AdvertisedItemInfoDialogComponent;
  let fixture: ComponentFixture<AdvertisedItemInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisedItemInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisedItemInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
