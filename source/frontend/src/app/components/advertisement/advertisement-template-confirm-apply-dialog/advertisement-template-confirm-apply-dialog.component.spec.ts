import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementTemplateConfirmApplyDialogComponent } from './advertisement-template-confirm-apply-dialog.component';

describe('AdvertisementTemplateConfirmApplyDialogComponent', () => {
  let component: AdvertisementTemplateConfirmApplyDialogComponent;
  let fixture: ComponentFixture<AdvertisementTemplateConfirmApplyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementTemplateConfirmApplyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementTemplateConfirmApplyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
