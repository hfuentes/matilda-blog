import { TestBed } from '@angular/core/testing';

import { FileValidatorsService } from './file-validators.service';

describe('FileValidatorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileValidatorsService = TestBed.get(FileValidatorsService);
    expect(service).toBeTruthy();
  });
});
