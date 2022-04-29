import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core"
import {Cart} from "../model/cart/cart"
import {CookieService} from "ngx-cookie-service";
import {CookieKeys} from "../model/constants";
import {CartOwnership} from "../model/cart/cart-ownership";
import {User} from "../model/user";
import {CartUser} from "../model/cart/cart-user";

@Component({
  selector: "app-cart-meta-information",
  template: `
    <div class="meta-information-container">
      <div class="meta-information-texts">
        <p *ngIf="showTitle" class="cart-name">{{ cart.name }}</p>
        <p *ngIf="showStatus">
          {{ "cart.status" | translate }}:
          <span [className]="cart.status | CartStatus">{{ cart.status | StatusLocalize }}</span>
        </p>
        <p *ngIf="showAmountOfProducts">
          {{ "cart.amountOfProducts" | translate }}:
          {{ amountOfProducts }} {{ "product.unit" | translate}}
        </p>
        <p *ngIf="showCreatedAt">
          {{ "cart.createdAt" | translate }}:
          <span>{{ cart.createdAt | date : 'dd.MM.yyyy HH:mm'}}</span>
        </p>
        <p *ngIf="showCartParticipants">
          {{ "cart.participants" | translate }}
          <app-name-tags [users]="participants"></app-name-tags>
        </p>
        <p *ngIf="showOwnerInvitation && !currentUserIsOwner">
          <app-name-tags [users]="[owner]"></app-name-tags>
          {{ "cart.invitation" | translate }}
        </p>
      </div>
<!--      <div *ngIf="showCartOptions" class="cart-options-button">-->
<!--        <button class="cart-options-button" mat-icon-button-->
<!--                [matMenuTriggerFor]="cartOptionsMenu">-->
<!--          <mat-icon>more_vert</mat-icon>-->
<!--        </button>-->
<!--        <mat-menu #cartOptionsMenu="matMenu" class="cart-options-button">-->
<!--          <button mat-menu-item (click)="displayCartOptions()">-->
<!--            <mat-icon>settings</mat-icon>-->
<!--            <span>{{ "cart.options.modify" | translate }}</span>-->
<!--          </button>-->
<!--        </mat-menu>-->
<!--      </div>-->
    </div>
  `,
  styles: [`
    .meta-information-container {

    }
    .meta-information-texts {
      /*float: left;*/
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

  userId: number
  currentUserIsOwner: boolean
  owner: User
  participants: User[]

  @Input() cart: Cart
  @Input() amountOfProducts: number = 0

  @Input() showTitle: boolean = true
  @Input() showStatus: boolean = true
  @Input() showAmountOfProducts: boolean = true
  @Input() showCreatedAt: boolean = true
  @Input() showOwnerInvitation: boolean = true
  @Input() showCartParticipants: boolean = true
  @Input() showCartOptions: boolean = true

  @Output() onOptionClick: EventEmitter<string> = new EventEmitter<string>()

  constructor(private cookieService: CookieService) {}

  ngOnChanges(): void {
    this.userId = Number(this.cookieService.get(CookieKeys.id))

    this.initCartParticipants()
    this.initOwnerInviteDisplay()
  }

  displayCartOptions(): void {
    this.onOptionClick.emit("options")
  }

  private initCartParticipants(): void {
    if (this.cart && this.cart.cartUsers && this.showCartParticipants) {
      this.participants = this.cart.cartUsers.map(cartUser => cartUser.user)
    }
  }

  private initOwnerInviteDisplay(): void {
    if (this.cart && this.cart.cartUsers) {
      const owner: User | undefined =
        this.cart.cartUsers.find((cartUser: CartUser) =>
          CartOwnership[cartUser.cartOwnership] === CartOwnership.OWNER)?.user

      if (!owner) {
        console.error("Could not find the owner of the cart: '" + this.cart.id + "'")
        return
      }

      this.currentUserIsOwner = this.userId === owner.id
      this.owner = owner
    }
  }
}
