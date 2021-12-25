import {Component, OnInit, ViewChild} from '@angular/core'
import {Cart} from "../../model/cart/cart"
import {ActivatedRoute, Router} from "@angular/router"
import {CartService} from "../../services/cart.service"
import {MatDialog, MatDialogRef} from "@angular/material/dialog"
import {ProductsListComponent} from "../../products/product-table/products-list.component"
import {ModifyCartDialogComponent} from "../../components/dialogs/cart/modify-cart-dialog.component"
import {CartAction, CartDialogAction} from "../../model/constants"
import {CartStatus} from "../../model/status/cartStatus"
import {MessageService} from "../../services/message.service"
import {AddFriendToCartDialogComponent} from "../../components/dialogs/friend/add-friend-to-cart-dialog.component"
import {User} from "../../model/user"

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  @ViewChild(ProductsListComponent) productTableComponent: ProductsListComponent

  cart: Cart
  amountOfProducts: number = 0

  buttons: string[] = ["edit"]

  statusCreated: CartStatus = CartStatus.CREATED
  statusInProgress: CartStatus = CartStatus.IN_PROGRESS
  statusDone: CartStatus = CartStatus.DONE

  constructor(private route: ActivatedRoute,
              private router: Router,
              private addProductDialog: MatDialog,
              private modifyCartDialog: MatDialog,
              private addFriendDialog: MatDialog,
              private cartService: CartService,
              private messageService: MessageService) {}

  ngOnInit(): void {
    const cartId: string | null = this.route.snapshot.paramMap.get("id")
    this.cartService.getCart(Number(cartId))
      .subscribe(cart => this.cart = cart)
  }

  handleClick(button: string): void {
    if (button === "edit") {
      this.handleModifyCart()
    }
  }

  private handleModifyCart(): void {
    const dialogRef: MatDialogRef<ModifyCartDialogComponent> =
      this.modifyCartDialog.open(
        ModifyCartDialogComponent, { data: { cart: this.cart }})

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

  updateProductAmountCounter(amount: number): void {
    this.amountOfProducts = amount
  }

  inviteFriend(): void {
    const dialogRef: MatDialogRef<AddFriendToCartDialogComponent> =
      this.addFriendDialog.open(
        AddFriendToCartDialogComponent,
        { panelClass: "friends-dialog", data: { cartId: this.cart.id }})

    dialogRef.afterClosed().subscribe((updatedData: { cart: Cart, user: User}) => {
      if (updatedData?.cart && updatedData?.user) {
        this.messageService.showInfo(
          "addFriend.requestSentNotification",
          1500,
          { username: updatedData.user.username })
        this.cart = updatedData.cart
      }
    })
  }

  updateCartStatus(status: CartStatus): void {
    this.cartService.changeCartStatus(this.cart.id, status)
      .subscribe((updatedCart: Cart) => {
        this.messageService.showInfo(
          "cart.statusChanged",
          1000,
          { name: this.cart.name })
        this.cart.status = updatedCart.status
      })
  }
}
