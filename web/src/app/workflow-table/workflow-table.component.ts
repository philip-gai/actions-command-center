import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-workflow-table',
  templateUrl: './workflow-table.component.html',
  styleUrls: ['./workflow-table.component.scss']
})
export class WorkflowTableComponent {
  @Input() public workflowRuns: any[] = [];
}
