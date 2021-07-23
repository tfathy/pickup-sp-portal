import { TestBed } from '@angular/core/testing';

import { SubscribeRequestService } from './subscribe-request.service';

describe('SubscribeRequestService', () => {
  let service: SubscribeRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscribeRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
