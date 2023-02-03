import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatedEntityPreviewCardTableComponent } from './rated-entity-preview-card-table.component';

describe('RatedEntityPreviewCardTableComponent', () => {
  let component: RatedEntityPreviewCardTableComponent;
  let fixture: ComponentFixture<RatedEntityPreviewCardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatedEntityPreviewCardTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatedEntityPreviewCardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
