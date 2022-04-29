import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core'
import {Friendship} from "../../model/friendship"
import {CookieService} from "ngx-cookie-service"
import {CookieKeys} from "../../model/constants"

@Component({
  selector: 'app-general-user-list',
  template: `
    <div *ngIf="friendships && friendships.length > 0 else displayNoFriendships">
      <mat-list *ngFor="let friendship of friendships; let i = index">
        <mat-list-item>
          <span class="username-container">
            <span *ngIf="friendship.user.id === userId else showCurrentUser">
              {{ friendship.friend.username }}
            </span>
            <ng-template #showCurrentUser>
              {{ friendship.user.username }}
            </ng-template>
          </span>
          <span class="action-container">
            <mat-icon *ngIf="acceptIcon" matRipple (click)="onAccept(friendship)">
              {{ acceptIcon }}
            </mat-icon>
            <mat-icon matRipple (click)="onDeny(friendship)">
              {{ denyIcon }}
            </mat-icon>
          </span>
        </mat-list-item>
        <mat-divider *ngIf="friendships.length - 1 > i"></mat-divider>
      </mat-list>

    </div>
    <ng-template #displayNoFriendships>
      <mat-list>
        <mat-list-item>
          <mat-list-text class="empty-text">{{ emptyText | translate }}</mat-list-text>
        </mat-list-item>
      </mat-list>
    </ng-template>
  `,
  styles: [`
    .empty-text {
      margin: auto;
    }
    .username-container {
      width: 90%;
    }
    .action-container {
      width: 10%;
      display: contents;
    }
    .action-container mat-icon {
      margin-right: .3em;
    }
  `]
})
export class GeneralUserListComponent implements OnChanges {

  userId: number

  @Input() friendships: Friendship[]
  @Input() emptyText: string

  @Input() acceptIcon?: string
  @Input() denyIcon: string

  @Output() onAcceptEvent: EventEmitter<Friendship> = new EventEmitter<Friendship>()
  @Output() onDenyEvent: EventEmitter<Friendship> = new EventEmitter<Friendship>()

  constructor(private cookieService: CookieService) {
  }

  ngOnChanges(): void {
    this.userId = Number(this.cookieService.get(CookieKeys.id))
  }

  onAccept(friendship: Friendship): void {
    this.onAcceptEvent.emit(friendship)
  }

  onDeny(friendship: Friendship): void {
    this.onDenyEvent.emit(friendship)
  }
}
