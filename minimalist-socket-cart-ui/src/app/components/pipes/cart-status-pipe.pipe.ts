import {Pipe, PipeTransform} from '@angular/core'
import {CartStatus} from "../../model/status/cartStatus"

@Pipe({ name: 'CartStatus' })
export class CartStatusPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case CartStatus.CREATED.valueOf():
        return "created"
      case CartStatus.DONE.valueOf():
        return "done"
      case CartStatus.IN_PROGRESS.valueOf():
        return "in_progress"
      default:
        return ""
    }
  }
}
