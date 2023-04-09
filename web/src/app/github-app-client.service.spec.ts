import { TestBed } from '@angular/core/testing';

import { GithubAppClientService } from './github-app-client.service';

describe('GithubAppClientService', () => {
  let service: GithubAppClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubAppClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
