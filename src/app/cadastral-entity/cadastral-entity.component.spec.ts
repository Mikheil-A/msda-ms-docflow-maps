import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastralEntityComponent } from './cadastral-entity.component';

describe('CadastralEntityComponent', () => {
  let component: CadastralEntityComponent;
  let fixture: ComponentFixture<CadastralEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastralEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastralEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
