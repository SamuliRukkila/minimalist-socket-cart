import {Component, Input, OnChanges} from '@angular/core';
import {User} from "../../model/user";

@Component({
  selector: "app-name-tags",
  template: `
    <div *ngFor="let user of users" class="name-tags-container">
      <div [ngClass]="user.isConnectedToCart ? 'user-present-in-cart' : 'user-not-present-in-cart'" class="tag">
        {{ user.username }}
      </div>
    </div>
  `,
  styles: [`
    .name-tags-container {
      width: fit-content;
      display: inline-block;
    }
    .tag {
      padding: .1em .8em;
      color: white;
      border-radius: 10px;
      margin-right: .3em;
      margin-top: .2em;
    }
    .user-present-in-cart {
      background-color: darkgreen;
    }
    .user-not-present-in-cart {
      background-color: dimgray;
    }
  `]
})
export class NameTagsComponent implements OnChanges {

  @Input() users: User[] = []

  sortedUsers: User[]

  ngOnChanges(): void {
    this.sortUsersByBeingPresentInCartAndUsername()
  }

  private sortUsersByBeingPresentInCartAndUsername(): void {
    this.sortedUsers = this.users.sort((user1: User, user2: User) => {
      const user1PresentInCart: number = Number(user1.isConnectedToCart)
      const user2PresentInCart: number = Number(user2.isConnectedToCart)

      if (user1PresentInCart !== user2PresentInCart) {
        return user1PresentInCart - user2PresentInCart
      }

      return user1.username.localeCompare(user2.username)
    })
  }
}
