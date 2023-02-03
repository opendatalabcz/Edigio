import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatedEntityPreviewCardComponent } from './rated-entity-preview-card.component';

describe('RatedEntityPreviewCardComponent', () => {
  let component: RatedEntityPreviewCardComponent;
  let fixture: ComponentFixture<RatedEntityPreviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatedEntityPreviewCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatedEntityPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
