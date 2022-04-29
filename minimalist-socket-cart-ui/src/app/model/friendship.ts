import {FriendshipStatus} from "./status/friendship-status"
import {User} from "./user"

export interface Friendship {
  user: User
  friend: User
  status: FriendshipStatus
}
