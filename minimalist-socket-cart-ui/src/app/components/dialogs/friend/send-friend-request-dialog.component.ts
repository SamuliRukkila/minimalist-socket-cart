import {Component, OnInit} from '@angular/core'
import {MatDialogRef} from "@angular/material/dialog"
import {MessageService} from "../../../services/message.service"
import {User} from "../../../model/user"
import {FriendshipService} from "../../../services/friendship.service"

@Component({
  selector: "app-send-friend-request-dialog",
  template: `
    <app-choose-user-list
      title="sendFriendRequest.title"
      searchUserText="sendFriendRequest.searchUsers"
      noUsersFoundText="sendFriendRequest.usersNotFound"
      userTableRowTitle="sendFriendRequest.userTableRowTitle"
      foundUserAmountText="sendFriendRequest.foundUserAmountText"
      helpSearchMessage="sendFriendRequest.helpSearchMessage"
      onSubmitText="sendFriendRequest.sendFriendRequest"
      [showSearchbar]="true"
      (submit)="sendFriendRequest($event)">
    </app-choose-user-list>
  `,
  styles: [`
  `]
})
export class SendFriendRequestDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SendFriendRequestDialogComponent>,
              private messageService: MessageService,
              private friendshipService: FriendshipService) {}

  ngOnInit(): void {}

  sendFriendRequest(user: User): void {
    this.friendshipService.sendFriendRequest(user.id).subscribe(() => {
      this.messageService.showInfo(
        "sendFriendRequest.requestSentNotification",
        2000,
        { username: user.username })
      this.close(user)
    })
  }

  private close(user?: User): void {
    this.dialogRef.close(user)
  }
}
