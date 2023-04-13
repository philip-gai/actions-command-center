import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitHubCallbackComponent } from './github-callback.component';

describe('GitHubCallbackComponent', () => {
  let component: GitHubCallbackComponent;
  let fixture: ComponentFixture<GitHubCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GitHubCallbackComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GitHubCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
