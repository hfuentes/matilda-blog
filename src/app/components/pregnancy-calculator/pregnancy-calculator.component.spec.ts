import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PregnancyCalculatorComponent } from './pregnancy-calculator.component';

describe('PregnancyCalculatorComponent', () => {
  let component: PregnancyCalculatorComponent;
  let fixture: ComponentFixture<PregnancyCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PregnancyCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregnancyCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
