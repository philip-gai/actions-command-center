import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Repository } from '../repository';

@Component({
  selector: 'app-repo-table',
  templateUrl: './repo-table.component.html',
  styleUrls: ['./repo-table.component.scss']
})
export class RepoTableComponent {
  @Input() data$!: Observable<Repository[]>;
  @Input() totalCount!: number;
  @Input() onRepoSelected!: (repo: string) => void
  @Input() displayedColumns: string[] = ['name', 'private', 'stars', 'topics', 'actions'];
  @Input() actions: RepoAction[] = [];

  public shouldShowAction(action: RepoAction): boolean {
    return this.actions.includes(action);
  }
}

export type RepoAction = 'follow' | 'unfollow';
