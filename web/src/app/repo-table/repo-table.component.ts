import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '../repository';

@Component({
  selector: 'app-repo-table',
  templateUrl: './repo-table.component.html',
  styleUrls: ['./repo-table.component.scss']
})
export class RepoTableComponent {
  @Input() repos$?: Observable<Repository[]>;
  private _repos?: Repository[] | undefined;
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

  useReposArray = false;

  public shouldShowAction(action: RepoAction): boolean {
    return this.actions.includes(action);
  }
}

export type RepoAction = 'follow' | 'unfollow';
