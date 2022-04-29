import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {Cart} from "../../model/cart/cart"
import {ActivatedRoute, Router} from "@angular/router"
import {CartService} from "../../services/cart.service"
import {MatDialog, MatDialogRef} from "@angular/material/dialog"
import {ProductsListComponent} from "../../products/product-table/products-list.component"
import {ModifyCartDialogComponent} from "../../components/dialogs/cart/modify-cart-dialog.component"
import {CartAction, CartDialogAction, CookieKeys} from "../../model/constants"
import {CartStatus} from "../../model/status/cart-status"
import {MessageService} from "../../services/message.service"
import {AddFriendToCartDialogComponent} from "../../components/dialogs/friend/add-friend-to-cart-dialog.component"
import {User} from "../../model/user"
import {CartSocketService} from "../../services/socket/cart/cart-socket.service";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {CartOptions} from "./cart-options";
import {LocalCookieService} from "../../services/local-cookie.service";
import {CartSocketMessageContainer} from "../../model/socket-message-containers";
import {CartUser} from "../../model/cart/cart-user";
import {CartOwnership} from "../../model/cart/cart-ownership";
import {CartUtils} from "../../components/utils/cart-utils";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  @ViewChild(ProductsListComponent) productTableComponent: ProductsListComponent

  cart: Cart
  amountOfProducts: number = 0
  cartUsers: User[]

  hideClearedProductRows: boolean

  currentUser: User
  currentUserIsOwner: boolean

  buttons: string[] = ["edit"]

  cartStatuses: CartStatus[] = [CartStatus.WAITING, CartStatus.IN_PROGRESS, CartStatus.DONE]
  statusDone: string = CartStatus.DONE.toString()

  constructor(public cartSocketService: CartSocketService,
              private route: ActivatedRoute,
              private router: Router,
              private matDialog: MatDialog,
              private cartOptionsBottomSheet: MatBottomSheet,
              private cookieService: LocalCookieService,
              private cartService: CartService,
              private messageService: MessageService) {
    this.subscribeToSocketMessages()
  }

  ngOnInit(): void {
    this.currentUser = this.cookieService.getCurrentUser()

    this.checkForChangedValues()
    this.initCart()
  }

  ngOnDestroy(): void {
    this.cartSocketService.disconnect()
  }

  private subscribeToSocketMessages(): void {
    this.cartSocketService.nameUpdatedSubject.subscribe(
      (container: CartSocketMessageContainer) => this.cart.name = container.cart.name)

    this.cartSocketService.statusUpdatedSubject.subscribe(
      (container: CartSocketMessageContainer) => this.cart.status = container.cart.status)

    this.cartSocketService.cartDeletedSubject.subscribe(() => {
      this.matDialog.closeAll()
      this.router.navigate(["carts"])
    })
  }

  private checkForChangedValues(): void {
    this.hideClearedProductRows = this.cookieService.getBoolean(CookieKeys.hideCollectedProductRows)
  }

  private initCart(): void {
    const cartId: string | number | null = this.route.snapshot.paramMap.get("id")
    if (!cartId) {
      this.router.navigate(["carts"])
    }

    this.cartService.getCart(cartId!)
      .subscribe(cart => {
        if (!cart) {
          this.router.navigate(["carts"])
        }

        this.cart = cart

        this.configureUsers(cart)
        this.configureWebsocket()
      })
  }

  private configureWebsocket(): void {
    this.cartSocketService.connect(this.cart.id)
  }

  handleClick(button: string): void {
    if (button === "edit") {
      this.modifyCart()
    }
  }

  private configureUsers(cart: Cart): void {
    this.cartUsers = cart.cartUsers.map(c => c.user)
    this.currentUserIsOwner = CartUtils.currentUserIsOwnerOfCart(cart, this.currentUser)
  }

  private modifyCart(): void {
    const dialogRef: MatDialogRef<ModifyCartDialogComponent> =
      this.matDialog.open(
        ModifyCartDialogComponent, { data: { cart: this.cart, currentUserIsOwner: this.currentUserIsOwner }})

    dialogRef.afterClosed().subscribe((cartAction: CartDialogAction) => {
      if (cartAction) {
        if (cartAction.action === CartAction.UPDATE) {
          this.cart.name = cartAction.cart!.name
        }
        else if (cartAction.action === CartAction.DELETE) {
          this.router.navigate(["carts"])
        }
      }
    })
  }

  openCartOptions(): void {
    const nextStatuses: CartStatus[] = this.getAvailableCartStatuses()

    this.cartOptionsBottomSheet.open(CartOptions, {
      data: {
        nextStatuses: nextStatuses
      }
    })
    .afterDismissed().subscribe((data: any) => {
      this.checkForChangedValues()
      this.executeCartOption(data)
    })
  }

  private executeCartOption(data: any): void {
    if (data) {
      switch (data.type) {

        case CartOptions.inviteFriendOption:
          this.inviteFriend()
          break

        case CartOptions.updateCartStatusOption:
          if (!data.nextStatus) {
            console.error(
              "Tried to change cart status without next status present. Cart: " + this.cart.id)
            return
          }
          this.updateCartStatus(data.nextStatus)
          break

        case CartOptions.modifyCartOption:
          this.modifyCart()
          break

        default:
          console.error("Unknown option selected for cart's (" + this.cart.id + ") option: " + data.type)
      }
    }
  }

  private getAvailableCartStatuses(): CartStatus[] {
    return this.cartStatuses.filter(status => status !== this.cart.status)
  }

  updateProductAmountCounter(amount: number): void {
    this.amountOfProducts = amount
  }

  inviteFriend(): void {
    const dialogRef: MatDialogRef<AddFriendToCartDialogComponent> =
      this.matDialog.open(
        AddFriendToCartDialogComponent,
        { panelClass: "friends-dialog", data: { cartId: this.cart.id }})

    dialogRef.afterClosed().subscribe((updatedData: { cart: Cart, user: User}) => {
      if (updatedData?.cart && updatedData.user) {
        this.messageService.showInfo(
          "addFriend.requestSentNotification",
          1500,
          { username: updatedData.user.username })
        this.cart = updatedData.cart
      }
    })
  }

  updateCartStatus(status: CartStatus): void {
    this.cartService.updateCartStatus(this.cart.id, status)
      .subscribe((updatedCart: Cart) => {
        this.messageService.showInfo(
          "cart.actions.statusChanged",
          1000,
          { name: this.cart.name })
        this.cart.status = updatedCart.status
      })
  }
}
