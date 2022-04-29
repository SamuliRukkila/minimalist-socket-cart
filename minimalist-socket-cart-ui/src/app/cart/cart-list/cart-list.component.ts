import {Component, OnInit} from '@angular/core'
import {Cart} from "../../model/cart/cart"
import {CartService} from "../../services/cart.service"
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop"
import {MatDialog, MatDialogRef} from "@angular/material/dialog"
import {AddCartDialogComponent} from "../../components/dialogs/cart/add-cart-dialog.component"
import {Router} from "@angular/router"
import {ModifyCartDialogComponent} from "../../components/dialogs/cart/modify-cart-dialog.component"
import {CartAction, CartDialogAction} from "../../model/constants"
import {ProductService} from "../../services/product.service"
import {CartStatus} from "../../model/status/cart-status"
import {CartUtils} from "../../components/utils/cart-utils";
import {User} from "../../model/user";
import {LocalCookieService} from "../../services/local-cookie.service";

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {
  INITIAL_BUTTONS: string[] = ["edit", "sort"]
  EDIT_BUTTONS: string[] = ["check"]

  currentUser: User

  carts: Cart[]
  buttons: string[] = this.INITIAL_BUTTONS

  inEditMode: boolean = false
  amountOfInProgressCarts: number = 0

  areCartsLoading: boolean

  constructor(private cartService: CartService,
              private productService: ProductService,
              private cookieService: LocalCookieService,
              private addCartDialog: MatDialog,
              private modifyCartDialog: MatDialog,
              private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.cookieService.getCurrentUser()

    this.areCartsLoading = true
    this.cartService.getCarts()
      .subscribe(carts => {
        this.carts = carts
        this.amountOfInProgressCarts = this.countInProgressCarts(carts)
      },
      () => {},
      () => this.areCartsLoading = false)
  }

  handleClick(button: string) {
    if (button === "edit" || button === "check") {
      this.handleEditMode()
    }
  }

  private handleEditMode(): void {
    this.inEditMode = !this.inEditMode
    this.buttons = this.inEditMode ?
      this.EDIT_BUTTONS : this.INITIAL_BUTTONS
  }

  createCart(): void {
    this.openCartDialog()
  }

  private openCartDialog(): void {
    const dialogRef: MatDialogRef<AddCartDialogComponent> = this.addCartDialog.open(AddCartDialogComponent)
    dialogRef.afterClosed().subscribe((cart: Cart) => {
      if (cart) {
        this.router.navigate(["carts", cart.id])
      }
    })
  }

  drop(event: CdkDragDrop<Cart[]>) {
    moveItemInArray(this.carts, event.previousIndex, event.currentIndex)
  }

  modifyCart(cart: Cart): void {
    const currentUserIsOwner: boolean = CartUtils.currentUserIsOwnerOfCart(cart, this.currentUser)

    const dialogRef: MatDialogRef<ModifyCartDialogComponent> =
      this.modifyCartDialog.open(
        ModifyCartDialogComponent, { data: { cart: cart, currentUserIsOwner: currentUserIsOwner }})

    dialogRef.afterClosed().subscribe((cartAction: CartDialogAction) => {
      if (cartAction) {
        if (cartAction.action === CartAction.UPDATE) {
          this.updateCartInArray(cartAction.cart!)
        }
        else if (cartAction.action === CartAction.DELETE) {
          this.deleteCartInArray(cartAction.cart!.id)
        }
      }
    })
  }

  private countInProgressCarts(carts: Cart[]): number {
    return carts.filter(cart => cart.status === CartStatus.IN_PROGRESS).length
  }

  private updateCartInArray(updatedCart: Cart): void {
    this.carts.forEach(cart => {
      if (cart.id === updatedCart.id) {
        cart.name = updatedCart.name
      }
    })
  }

  private deleteCartInArray(cartId: number): void {
    this.carts = this.carts.filter(cart => cart.id !== cartId)
  }
}
