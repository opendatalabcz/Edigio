import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementResponseAcceptDialogComponent } from './advertisement-response-accept-dialog.component';

describe('AdvertisementResponseAcceptDialogComponent', () => {
  let component: AdvertisementResponseAcceptDialogComponent;
  let fixture: ComponentFixture<AdvertisementResponseAcceptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementResponseAcceptDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementResponseAcceptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
