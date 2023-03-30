import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentReviewDialogComponent } from './deployment-review-dialog.component';

describe('DeploymentReviewDialogComponent', () => {
  let component: DeploymentReviewDialogComponent;
  let fixture: ComponentFixture<DeploymentReviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeploymentReviewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeploymentReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
