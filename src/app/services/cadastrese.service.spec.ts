import { TestBed } from '@angular/core/testing';

import { CadastreseService } from './cadastrese.service';

describe('CadastreseService', () => {
  let service: CadastreseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadastreseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
