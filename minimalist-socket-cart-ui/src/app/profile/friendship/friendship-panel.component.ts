import {Component, Input, OnChanges} from '@angular/core'
import {Friendship} from "../../model/friendship"
import {FriendshipStatus} from "../../model/status/friendship-status"
import {FriendshipService} from "../../services/friendship.service"
import {MatDialog, MatDialogRef} from "@angular/material/dialog"
import {ConfirmDialogComponent} from "../../components/dialogs/confirm-dialog.component"
import {MessageService} from "../../services/message.service"
import {CookieService} from "ngx-cookie-service"
import {SendFriendRequestDialogComponent} from "../../components/dialogs/friend/send-friend-request-dialog.component"
import {User} from "../../model/user"

@Component({
  selector: 'app-friendship-panel',
  template: `
    <mat-expansion-panel class="friends-expansion-panel">
      <mat-expansion-panel-header>
        <mat-panel-title>
          {{ "profile.friends" | translate }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <mat-tab-group mat-stretch-tabs animationDuration="250ms">
        <mat-tab>
          <ng-template mat-tab-label>
            <span [matBadge]="friendships.length" matBadgeOverlap="false">
              {{ 'profile.groups.friends.title' | translate }}
            </span>
          </ng-template>
          <app-general-user-list
            [friendships]="friendships"
            (onDenyEvent)="removeFriendship($event)"
            denyIcon="clear"
            emptyText="profile.groups.friends.empty">
          </app-general-user-list>
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <span [matBadge]="requestSentFriendships.length" matBadgeOverlap="false">
              {{ 'profile.groups.requestSent.title' | translate }}
            </span>
          </ng-template>
          <app-general-user-list
            [friendships]="requestSentFriendships"
            (onDenyEvent)="removeFriendshipRequest($event)"
            denyIcon="clear"
            emptyText="profile.groups.requestSent.empty">
            ></app-general-user-list>
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <span [matBadge]="requestReceivedFriendships.length" matBadgeOverlap="false">
              {{ 'profile.groups.requestReceived.title' | translate }}
            </span>
          </ng-template>
          <app-general-user-list
            [friendships]="requestReceivedFriendships"
            (onAcceptEvent)="handleReceivedFriendshipRequest($event, true)"
            (onDenyEvent)="handleReceivedFriendshipRequest($event, false)"
            acceptIcon="check"
            denyIcon="clear"
            emptyText="profile.groups.requestReceived.empty">
            ></app-general-user-list>
        </mat-tab>
      </mat-tab-group>

      <mat-action-row>
        <button mat-button class="mat-raised-button main-button"
                (click)="sendFriendRequest()">{{ "profile.sendFriendRequest" | translate }}</button>
      </mat-action-row>
    </mat-expansion-panel>
  `,
  styles: [`
    .mat-badge-medium.mat-badge-above .mat-badge-content {
      top: -1px;
      right: -26px;
    }
  `]
})
export class FriendshipPanelComponent implements OnChanges {

  @Input() friendships: Friendship[] = []
  @Input() requestSentFriendships: Friendship[] = []
  @Input() requestReceivedFriendships: Friendship[] = []
  @Input() isLoggedIn: boolean

  constructor(private friendshipService: FriendshipService,
              private messageService: MessageService,
              private cookieService: CookieService,
              private confirmDialog: MatDialog,
              private addFriendsDialog: MatDialog) {}

  ngOnChanges(): void {
    if (this.isLoggedIn) {
      this.initFriendships()
    }
  }

  sendFriendRequest(): void {
    const dialogRef: MatDialogRef<SendFriendRequestDialogComponent> =
      this.addFriendsDialog.open(SendFriendRequestDialogComponent, { panelClass: "friends-dialog" })

    dialogRef.afterClosed().subscribe((user: User) => {
      if (user) {
        this.initFriendships()
      }
    })
  }

  removeFriendship(friendship: Friendship): void {
    const friendUsername: string = friendship.friend.username

    const confirmDialogRef: MatDialogRef<ConfirmDialogComponent> =
      this.confirmDialog.open(ConfirmDialogComponent,
        { data: {
            title: "removeFriend.title",
            content: "removeFriend.content",
            contentParams: { username: friendUsername }
          }})

    confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.friendshipService.removeFriendship(friendship.friend.id).subscribe(() => {
          this.initFriendships()
          this.messageService.showInfo("removeFriend.success", 1500, { username: friendUsername })
        })
      }
    })
  }

  removeFriendshipRequest(friendship: Friendship): void {
    const friendUsername: string = friendship.friend.username

    const confirmDialogRef: MatDialogRef<ConfirmDialogComponent> =
      this.confirmDialog.open(ConfirmDialogComponent,
        { data: {
            title: "removeFriendshipRequest.title",
            content: "removeFriendshipRequest.content",
            contentParams: { username: friendUsername }
          }})

    confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.friendshipService.deleteFriendRequest(friendship.friend.id).subscribe(() => {
          this.initFriendships()
          this.messageService.showInfo(
            "removeFriendshipRequest.success", 1500, { username: friendUsername })
        })
      }
    })
  }

  handleReceivedFriendshipRequest(friendship: Friendship, accept: boolean): void {
    const friendUsername: string = friendship.friend.username
    if (accept) {
      this.friendshipService.acceptFriendRequest(friendship.friend.id).subscribe(() => {
        this.initFriendships()
        this.messageService.showInfo(
          "acceptFriendshipRequest.success", 1500, { username: friendUsername }
        )
      })
    }
    else {
      const confirmDialogRef: MatDialogRef<ConfirmDialogComponent> =
        this.confirmDialog.open(ConfirmDialogComponent,
          { data: {
              title: "rejectFriendshipRequest.title",
              content: "rejectFriendshipRequest.content",
              contentParams: { username: friendUsername }
          }}
        )
      confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.friendshipService.rejectFriendshipRequest(friendship.friend.id).subscribe(() => {
            this.initFriendships()
            this.messageService.showInfo(
              "rejectFriendshipRequest.success", 1500, { username: friendUsername }
            )
          })
        }
      })
    }
  }

  private initFriendships(): void {
    this.friendships = []
    this.requestSentFriendships = []
    this.requestReceivedFriendships = []

    this.friendshipService.findAllFriendships().subscribe(
      (friendships: Friendship[]) => {
        for (const friendship of friendships) {

          switch (friendship.status) {
            case FriendshipStatus.REQUEST_SENT:
              this.requestSentFriendships.push(friendship)
              break
            case FriendshipStatus.REQUEST_RECEIVED:
              this.requestReceivedFriendships.push(friendship)
              break
            case FriendshipStatus.CONFIRMED:
              this.friendships.push(friendship)
              break
            default:
              console.warn("Unknown friendship-status received. " +
                "Skipping friendship. Status: " + friendship.status)
          }
        }
      })
  }
}
