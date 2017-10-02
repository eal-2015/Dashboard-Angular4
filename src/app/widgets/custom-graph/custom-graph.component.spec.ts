import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGraphComponent } from './custom-graph.component';

describe('CustomGraphComponent', () => {
  let component: CustomGraphComponent;
  let fixture: ComponentFixture<CustomGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
