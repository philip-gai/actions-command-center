import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoWorkflowsComponent } from './repo-workflows.component';

describe('RepoWorkflowsComponent', () => {
  let component: RepoWorkflowsComponent;
  let fixture: ComponentFixture<RepoWorkflowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepoWorkflowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoWorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
