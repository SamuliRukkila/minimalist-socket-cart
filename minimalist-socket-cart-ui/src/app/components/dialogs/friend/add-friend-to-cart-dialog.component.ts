import {Component, Inject, OnInit} from '@angular/core'
import {User} from "../../../model/user"
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog"
import {MessageService} from "../../../services/message.service"
import {FriendshipService} from "../../../services/friendship.service"
import {CartService} from "../../../services/cart.service"
import {Cart} from "../../../model/cart/cart";

@Component({
  selector: 'app-add-friend-to-cart-dialog',
  template: `
    <app-choose-user-list
      title="addFriend.title"
      searchUserText="addFriend.searchUsers"
      noUsersFoundText="addFriend.usersNotFound"
      userTableRowTitle="addFriend.userTableRowTitle"
      foundUserAmountText="addFriend.foundUserAmountText"
      helpSearchMessage="addFriend.helpSearchMessage"
      onSubmitText="addFriend.sendFriendRequest"
      [showSearchbar]="true"
      [searchOnlyFromProvidedList]="true"
      [originalUserChoiceList]="friends"
      [userChoiceList]="friends"
      (submit)="addFriendToCart($event)">
    </app-choose-user-list>
  `,
  styles: [
  ]
})
export class AddFriendToCartDialogComponent implements OnInit {

  friends: User[] = []

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<AddFriendToCartDialogComponent>,
              private messageService: MessageService,
              private friendshipService: FriendshipService,
              private cartService: CartService) {}

  ngOnInit(): void {
    this.friendshipService.getFriends().subscribe((friends: User[]) => {
      this.friends = friends
    })
  }

  addFriendToCart(friend: User): void {
    this.cartService.addFriendToCart(this.data.cartId, friend.id)
      .subscribe((updateCart: Cart) => this.close(updateCart, friend))
  }

  private close(updatedCart: Cart, addedFriend: User): void {
    this.dialogRef.close({ cart: updatedCart, user: addedFriend })
  }
}
