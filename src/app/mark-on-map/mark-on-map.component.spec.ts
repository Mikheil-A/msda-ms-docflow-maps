import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkOnMapComponent } from './mark-on-map.component';

describe('MarkOnMapComponent', () => {
  let component: MarkOnMapComponent;
  let fixture: ComponentFixture<MarkOnMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkOnMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
