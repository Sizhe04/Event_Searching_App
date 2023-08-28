import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TosearchComponent } from './tosearch.component';

describe('TosearchComponent', () => {
  let component: TosearchComponent;
  let fixture: ComponentFixture<TosearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TosearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TosearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
