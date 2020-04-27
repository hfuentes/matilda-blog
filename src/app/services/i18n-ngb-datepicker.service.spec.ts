import { TestBed } from '@angular/core/testing';

import { CustomDatepickerI18n, I18n } from './i18n-ngb-datepicker.service';

describe('CustomDatepickerI18n', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomDatepickerI18n = TestBed.get(CustomDatepickerI18n);
    expect(service).toBeTruthy();
  });
});

describe('I18n', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: I18n = TestBed.get(I18n);
    expect(service).toBeTruthy();
  });
});
