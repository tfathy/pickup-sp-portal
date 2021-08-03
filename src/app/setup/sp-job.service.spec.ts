import { TestBed } from '@angular/core/testing';

import { SpJobService } from './sp-job.service';

describe('SpJobService', () => {
  let service: SpJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
