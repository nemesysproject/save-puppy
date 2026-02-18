import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedLogic } from './shared-logic.';

describe('SharedLogic', () => {
  let component: SharedLogic;
  let fixture: ComponentFixture<SharedLogic>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedLogic],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedLogic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
