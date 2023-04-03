import { TestBed } from '@angular/core/testing';

import { PlayerAmountService } from './player-amount.service';

describe('PlayerAmountService', () => {
  let service: PlayerAmountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerAmountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
