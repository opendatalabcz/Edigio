import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementResponseRejectDialogComponent } from './advertisement-response-reject-dialog.component';

describe('AdvertisementResponseAcceptDialogComponent', () => {
  let component: AdvertisementResponseRejectDialogComponent;
  let fixture: ComponentFixture<AdvertisementResponseRejectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementResponseRejectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementResponseRejectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
