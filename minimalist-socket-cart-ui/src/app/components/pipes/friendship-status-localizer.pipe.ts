import { Pipe, PipeTransform } from '@angular/core'
import {FriendshipStatus} from "../../model/status/friendshipStatus"

@Pipe({ name: "FriendshipStatus" })
export class FriendshipStatusPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case FriendshipStatus.REQUEST_SENT.valueOf():
        return "request_sent"
      case FriendshipStatus.REQUEST_RECEIVED.valueOf():
        return "request_received"
      case FriendshipStatus.CONFIRMED.valueOf():
        return "confirmed"
      default:
        return ""
    }
  }
}
