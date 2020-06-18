import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VectorialShapefileComponent } from './vectorial-shapefile.component';

describe('VectorialShapefileComponent', () => {
  let component: VectorialShapefileComponent;
  let fixture: ComponentFixture<VectorialShapefileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VectorialShapefileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VectorialShapefileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
