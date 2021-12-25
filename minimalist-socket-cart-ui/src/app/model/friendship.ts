import {FriendshipStatus} from "./status/friendshipStatus"
import {User} from "./user"

export interface Friendship {
  user: User
  friend: User
  status: FriendshipStatus
}
