import { Pipe, PipeTransform } from '@angular/core'
import {CartStatus} from "../../model/status/cart-status"
import {FriendshipStatus} from "../../model/status/friendship-status"
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'StatusLocalize'
})
export class StatusLocalizePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  transform(status: string): string {
    return this.translateService.instant(StatusLocalizePipe.getStatusText(status))
  }

  private static getStatusText(status: string): string {
    switch (status) {
      case CartStatus.WAITING.valueOf():
        return "cartStatus.waiting"
      case CartStatus.DONE.valueOf():
        return "cartStatus.done"
      case CartStatus.IN_PROGRESS.valueOf():
        return "cartStatus.inProgress"
      case FriendshipStatus.REQUEST_SENT.valueOf():
        return "friendshipStatus.requestSent"
      case FriendshipStatus.REQUEST_RECEIVED.valueOf():
        return "friendshipStatus.requestReceived"
      case FriendshipStatus.CONFIRMED.valueOf():
        return "friendshipStatus.confirmed"
      default:
        return ""
    }
  }
}
