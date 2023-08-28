import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesFormComponent } from './favorites-form.component';

describe('FavoritesFormComponent', () => {
  let component: FavoritesFormComponent;
  let fixture: ComponentFixture<FavoritesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
