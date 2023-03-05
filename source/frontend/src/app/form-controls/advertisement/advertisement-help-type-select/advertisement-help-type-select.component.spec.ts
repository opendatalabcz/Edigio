import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementHelpTypeSelectComponent } from './advertisement-help-type-select.component';

describe('AdvertisementTypeSelectComponent', () => {
  let component: AdvertisementHelpTypeSelectComponent;
  let fixture: ComponentFixture<AdvertisementHelpTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementHelpTypeSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementHelpTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
