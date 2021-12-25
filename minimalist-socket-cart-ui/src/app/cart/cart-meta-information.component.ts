import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core"
import {Cart} from "../model/cart/cart"
import {CookieService} from "ngx-cookie-service";
import {CookieKeys} from "../model/constants";
import {CartOwnership} from "../model/cart/cart-ownership";

@Component({
  selector: "app-cart-meta-information",
  template: `
    <div class="meta-information-container">
      <div class="meta-information-texts" routerLink="/carts/{{cart.id}}">
        <p *ngIf="showTitle" class="cart-name">{{ cart.name }}</p>
        <p *ngIf="showStatus">{{ "cart.status" | translate }}:
          <span [className]="cart.status | CartStatus">{{ cart.status | StatusLocalize }}</span>
        </p>
        <p *ngIf="showAmountOfProducts">{{ "cart.amountOfProducts" | translate }}:
          {{ amountOfProducts }} {{ "product.unit" | translate}}
        </p>
        <p *ngIf="showCreatedAt">{{ "cart.createdAt" | translate }}:
          <span>{{ cart.createdAt | date : 'dd.MM.yyyy HH:mm'}}</span>
        </p>
        <p *ngIf="isOwnerOfCart">Olet omistaja</p>
        <p *ngIf="showFriends">{{ "cart.friends" | translate }}:
          <span class="done" style="width: fit-content"></span>
        </p>
      </div>
      <div *ngIf="showCartOptions" class="cart-options-button">
        <button class="cart-options-button" mat-icon-button
                [matMenuTriggerFor]="cartOptionsMenu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #cartOptionsMenu="matMenu" class="cart-options-button">
          <button mat-menu-item (click)="displayCartOptions()">
            <mat-icon>settings</mat-icon>
            <span>{{ "cart.options.modify" | translate }}</span>
          </button>
        </mat-menu>
      </div>
    </div>
  `,
  styles: [`
    .meta-information-container {

    }
    .meta-information-texts {
      float: left;
    }
    .cart-options-button {
      float: right;
    }
    .cart-name {
      font-size: 16px;
    }
  `]
})
export class CartMetaInformationComponent implements OnChanges {

  userId: string
  isOwnerOfCart: boolean

  @Input() cart: Cart
  @Input() amountOfProducts: number = 0

  @Input() showTitle: boolean = true
  @Input() showStatus: boolean = true
  @Input() showAmountOfProducts: boolean = true
  @Input() showCreatedAt: boolean = true
  @Input() showFriends: boolean = true
  @Input() showCartOptions: boolean = true

  @Output() onOptionClick: EventEmitter<string> = new EventEmitter<string>()

  constructor(private cookieService: CookieService) {}

  ngOnChanges(): void {
    this.userId = this.cookieService.get(CookieKeys.id)
    this.checkIfCartOwner()
  }

  displayCartOptions(): void {
    this.onOptionClick.emit("options")
  }

  private checkIfCartOwner(): void {
    const cartOwnerId: number =
      this.cart.users
        .filter(cartUsers => cartUsers.cartOwnership === CartOwnership.OWNER)
        .map(cartUsers => cartUsers["id"]["userId"])[0]

    this.isOwnerOfCart = cartOwnerId === Number(this.userId)
  }
}
