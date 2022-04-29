import { Injectable } from '@angular/core'
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar"
import {TranslateService} from "@ngx-translate/core"

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private infoConfig: MatSnackBarConfig = new MatSnackBarConfig<any>()
  private warnConfig: MatSnackBarConfig = new MatSnackBarConfig<any>()
  private errorConfig: MatSnackBarConfig = new MatSnackBarConfig<any>()

  constructor(private snackBar: MatSnackBar, private translateService: TranslateService) {
    this.infoConfig.verticalPosition = "bottom"
    this.infoConfig.panelClass = ["message-info"]
    this.infoConfig.politeness = "polite"

    this.warnConfig.verticalPosition = "bottom"
    this.warnConfig.panelClass = ["message-warn"]
    this.warnConfig.politeness = "polite"

    this.errorConfig.verticalPosition = "bottom"
    this.errorConfig.panelClass = ["message-error"]
    this.errorConfig.politeness = "polite"
  }

  showInfo(message: string, duration?: number, params?: Object): void {
    this.infoConfig.duration = duration
    this.showMsg(message, this.infoConfig, params)
  }

  showWarn(message: string, duration: number, params?: Object): void {
    this.infoConfig.duration = duration
    this.showMsg(message, this.warnConfig, params)
  }

  showError(message: string, duration: number, params?: Object): void {
    this.errorConfig.duration = duration
    this.showMsg(message, this.errorConfig, params)
  }

  displayHelpMessagesInOrder(messages: string[], duration: number = 4000): void {
    this.infoConfig.duration = duration

    for (let i = 0; i < messages.length; i++) {
      if (i === 0) {
        this.showMsg(messages[i], this.infoConfig)
      }
      else {
        setTimeout(() =>
          this.showMsg(messages[i], this.infoConfig), duration * i)
      }
    }
  }

  private showMsg(messageKey, config: MatSnackBarConfig, params?: Object) {
    this.translateService.get(messageKey, params).subscribe(message =>
      this.snackBar.open(message, undefined, config),
      (error: unknown) => console.warn(error))
  }
}
