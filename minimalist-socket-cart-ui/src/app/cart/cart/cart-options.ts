import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet} from "@angular/material/bottom-sheet";
import {CookieKeys} from "../../model/constants";
import {LocalCookieService} from "../../services/local-cookie.service";

@Component({
  selector: 'app-cart-options',
  template: `
    <mat-slide-toggle style="margin: 20px 0"
                      [checked]="hideClearedProductRows"
                      (toggleChange)="toggleHideClearedProductRows()">
      {{ "cart.options.toggleClearedProducts" | translate }}
    </mat-slide-toggle>

    <mat-divider></mat-divider>

    <mat-nav-list>
      <a mat-list-item (click)="chooseInviteFriend()">
        <span mat-line>
          <mat-icon>supervised_user_circle</mat-icon>
          {{ "cart.options.inviteFriend.title" | translate }}
        </span>
        <span mat-line>{{ "cart.options.inviteFriend.description" | translate }}</span>
      </a>

      <a mat-list-item [matMenuTriggerFor]="statusSelectMenu">
        <span mat-line>
          <mat-icon>update</mat-icon>
          {{ "cart.options.updateStatus.title" | translate }}
        </span>
        <span mat-line>
          {{ "cart.options.updateStatus.description" | translate }}
        </span>
      </a>

      <a mat-list-item (click)="chooseModifyCart()">
        <span mat-line>
          <mat-icon>edit</mat-icon>
          {{ "cart.options.modifyCart.title" | translate }}
        </span>
        <span mat-line>{{ "cart.options.modifyCart.description" | translate }}</span>
      </a>

    </mat-nav-list>

    <mat-menu #statusSelectMenu yPosition="above">
      <span *ngFor="let status of data['nextStatuses']">
        <button mat-menu-item (click)="chooseUpdateCartStatus(status)"
                matTooltip="{{ 'cartStatus.tooltip.' + status | translate}}">
          {{ "cart.options.updateStatus.change" | translate }}
          <span [className]="status | CartStatus">
            {{ status | StatusLocalize }}
          </span>
        </button>
      </span>
    </mat-menu>

  `,
  styles: [
  ]
})
export class CartOptions implements OnInit {

  static inviteFriendOption: string = "inviteFriend"
  static modifyCartOption: string = "modifyCart"
  static updateCartStatusOption: string = "updateStatus"

  hideClearedProductRows: boolean

  constructor(private bottomSheet: MatBottomSheet,
              private localCookieService: LocalCookieService,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

  ngOnInit(): void {
    this.hideClearedProductRows = this.localCookieService.getBoolean(CookieKeys.hideCollectedProductRows)
  }

  toggleHideClearedProductRows(): void {
    this.hideClearedProductRows = !this.hideClearedProductRows
    this.localCookieService.setBoolean(CookieKeys.hideCollectedProductRows, this.hideClearedProductRows)
  }

  chooseInviteFriend(): void {
    this.closeBottomSheet(CartOptions.inviteFriendOption)
  }

  chooseUpdateCartStatus(nextStatus: string): void {
    this.closeBottomSheet(CartOptions.updateCartStatusOption, nextStatus)
  }

  chooseModifyCart(): void {
    this.closeBottomSheet(CartOptions.modifyCartOption)
  }

  closeBottomSheet(type: string, nextStatus?: string): void {
    this.bottomSheet.dismiss({ type,  nextStatus })
  }
}
