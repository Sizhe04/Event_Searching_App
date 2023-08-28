import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDetailsCardComponent } from './artist-details-card.component';

describe('ArtistDetailsCardComponent', () => {
  let component: ArtistDetailsCardComponent;
  let fixture: ComponentFixture<ArtistDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistDetailsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
