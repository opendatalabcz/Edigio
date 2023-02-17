import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementDetailComponent } from './advertisement-detail.component';
import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterTestingModule} from "@angular/router/testing";

describe('AdvertisementDetailComponent', () => {
  let component: AdvertisementDetailComponent;
  let fixture: ComponentFixture<AdvertisementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementDetailComponent ],
      imports: [TranslateModule.forRoot(), MatFormFieldModule, RouterTestingModule]
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
