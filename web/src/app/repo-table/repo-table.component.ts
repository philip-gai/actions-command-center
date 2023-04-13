import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '../repository';

@Component({
  selector: 'app-repo-table',
  templateUrl: './repo-table.component.html',
  styleUrls: ['./repo-table.component.scss']
})
export class RepoTableComponent {
  private _repos?: Repository[] = undefined;
  useReposArray = false;

  @Input() repos$?: Observable<Repository[]>;
  @Input()
  public get repos(): Repository[] | undefined {
    return this._repos;
  }
  public set repos(value: Repository[] | undefined) {
    this.useReposArray = true;
    this._repos = value;
  }
  @Input() totalCount!: number;
  @Input() onRepoAction!: (repo: Repository, action: RepoAction) => void
  @Input() displayedColumns: string[] = ['name', 'private', 'stars', 'topics', 'actions'];
  @Input() actions: RepoAction[] = [];
  @Input() messageIfNoRows = 'Nothing here to see.';

  public shouldShowAction(action: RepoAction): boolean {
    return this.actions.includes(action);
  }
}

export type RepoAction = 'follow' | 'unfollow';
