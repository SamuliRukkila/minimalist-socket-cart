import { Pipe, PipeTransform } from '@angular/core'
import {CartStatus} from "../../model/status/cartStatus"
import {FriendshipStatus} from "../../model/status/friendshipStatus"
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'StatusLocalize'
})
export class StatusLocalizePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  transform(status: string): string {
    let localizedText: string

    this.translateService.get(this.getStatusText())
      .subscribe(localized => localizedText = localized)

    return localizedText
  }

  private getStatusText(): string {
    switch (status) {
      case CartStatus.CREATED.valueOf():
        statusText = "cartStatus.created"
        break
      case CartStatus.DONE.valueOf():
        statusText = "cartStatus.done"
        break
      case CartStatus.IN_PROGRESS.valueOf():
        statusText = "cartStatus.inProgress"
        break
      case FriendshipStatus.REQUEST_SENT.valueOf():
        statusText = "friendshipStatus.requestSent"
        break
      case FriendshipStatus.REQUEST_RECEIVED.valueOf():
        statusText = "friendshipStatus.requestReceived"
        break
      case FriendshipStatus.CONFIRMED.valueOf():
        statusText = "confirmed"
        break
    }
  }
}
