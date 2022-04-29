import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'ProductCollectionIcon'
})
export class ProductCollectionIconPipe implements PipeTransform {
  transform(isCollected: boolean): string {
    if (isCollected) {
      return "radio_button_checked"
    }
    return "radio_button_unchecked"
  }

}
